import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage
} from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV3 } from "@ai-sdk/provider";
import { experimental_createMCPClient as createMCPClient } from "@ai-sdk/mcp";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { buildChatTools, truncateToolResultTransform } from "./tools";
import { loadSkillTool } from "./skills";

type LLMProvider = {
  type: "anthropic" | "openai";
  model?: string;
};

class HttpError extends Error {
  status: number;
  body?: string;

  constructor(message: string, status: number, body?: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

async function getBackendUrl() {
  const isClerkAuth = process.env.NEXT_PUBLIC_AUTH_IS_CLERK === "true";
  if (isClerkAuth) {
    const { sessionClaims } = auth();
    const orgId = sessionClaims?.org_id as string | undefined;

    if (!orgId) {
      throw new Error("Missing org_id in session claims");
    }

    const org = await clerkClient.organizations.getOrganization({
      organizationId: orgId
    });

    const backendUrl = org?.publicMetadata?.backend_url;
    if (typeof backendUrl === "string" && backendUrl.length > 0) {
      return backendUrl;
    }

    throw new Error("Missing backend_url in org publicMetadata");
  }

  const backendUrl = process.env.BACKEND_URL;
  if (backendUrl) {
    return backendUrl;
  }

  throw new Error("Missing BACKEND_URL env var");
}

function buildURL(base: string, endpoint: string) {
  const normalizedBase = base.endsWith("/") ? base : base + "/";
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint.slice(1)
    : endpoint;

  return new URL(normalizedEndpoint, normalizedBase);
}

// Mission Control calls the LLM provider on the chat's behalf and adds its credentials, so the chat only learns
// which provider SDK and model to use.
async function fetchLLMProvider(backendUrl: string, cookies: string) {
  const url = buildURL(backendUrl, "/llm/provider").toString();
  const response = await fetch(url, {
    headers: {
      Cookie: cookies
    },
    next: {
      revalidate: 5 * 60 // cache for 5 minutes
    }
  });

  if (!response.ok) {
    throw new HttpError(
      `failed to load the AI assistant: ${response.status}`,
      response.status,
      await response.text()
    );
  }

  return (await response.json()) as LLMProvider;
}

function buildLLMModel(
  provider: LLMProvider,
  backendUrl: string,
  cookies: string
): LanguageModelV3 {
  const settings = {
    baseURL: buildURL(backendUrl, "/llm/proxy").toString(),
    // Mission Control replaces it with the provider's key
    apiKey: "mission-control",
    headers: {
      Cookie: cookies
    }
  };

  switch (provider.type) {
    case "anthropic":
      return createAnthropic(settings)(provider.model ?? "claude-haiku-4-5");
    case "openai":
      return createOpenAI(settings)(provider.model ?? "gpt-4.1");
    default:
      throw new Error(`Unsupported LLM type: ${provider.type}`);
  }
}

function tryParseJSON(value?: string) {
  if (!value) {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function getErrorDetail(error: unknown): unknown {
  if (error instanceof HttpError) {
    return tryParseJSON(error.body);
  }

  if (!(error instanceof Error) || !error.cause) {
    return undefined;
  }

  if (error.cause instanceof Error) {
    const cause = error.cause as Error & {
      code?: string;
      errno?: string | number;
      address?: string;
      port?: number;
    };

    return {
      message: cause.message,
      code: cause.code,
      errno: cause.errno,
      address: cause.address,
      port: cause.port
    };
  }

  return error.cause;
}

export async function POST(req: Request) {
  let mcpClient: Awaited<ReturnType<typeof createMCPClient>> | undefined;

  const wideEvent: Record<string, any> = {
    event: "llm-conversation",
    timestamp: new Date().toISOString(),
    status: "started"
  };

  try {
    const {
      messages,
      alwaysAllowedTools = []
    }: { messages?: UIMessage[]; alwaysAllowedTools?: string[] } =
      await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: {
          "content-type": "application/json"
        }
      });
    }

    wideEvent.messages = messages.length;

    const backendUrl = await getBackendUrl();
    wideEvent.backendURL = backendUrl;

    const cookies = req.headers.get("cookie") ?? "";
    wideEvent.cookies = cookies.length;

    const llmProvider = await fetchLLMProvider(backendUrl, cookies);
    wideEvent.llm = {
      model: llmProvider.model,
      provider: llmProvider.type
    };

    const model = buildLLMModel(llmProvider, backendUrl, cookies);

    mcpClient = await createMCPClient({
      transport: {
        type: "http",
        url: buildURL(backendUrl, "/mcp").toString(),
        headers: {
          Cookie: cookies
        }
      }
    });
    wideEvent.mcpCreated = true;

    const tools = await buildChatTools(mcpClient, alwaysAllowedTools);
    wideEvent.totalTools = Object.entries(tools).length;

    const loadedSkillTool = await loadSkillTool();
    wideEvent.skills = {
      enabled: Boolean(loadedSkillTool.skillTool),
      count: loadedSkillTool.skillsCount,
      directory: loadedSkillTool.skillsDir
    };

    if (loadedSkillTool.error) {
      wideEvent.skills.error = loadedSkillTool.error;
    }

    if (loadedSkillTool.skillTool) {
      (tools as Record<string, unknown>).skill = loadedSkillTool.skillTool;
    }

    const modelMessages = await convertToModelMessages(messages, { tools });

    const result = streamText({
      model,
      messages: modelMessages,
      tools,
      system: "Answer concisely",
      stopWhen: stepCountIs(20),
      experimental_transform: truncateToolResultTransform,
      onError: async (error) => {
        wideEvent.status = "error";
        wideEvent.error = {
          error:
            error instanceof Error ? error.message : "Internal Server Error",
          detail: getErrorDetail(error),
          provider: wideEvent.llm?.provider,
          model: wideEvent.llm?.model
        };

        await mcpClient?.close();
        console.error(JSON.stringify(wideEvent));
      },
      onFinish: async (result) => {
        wideEvent.status = "completed";
        wideEvent.usage = {
          totalTokens: result.usage?.totalTokens
        };
        wideEvent.finishReason = result.finishReason;

        await mcpClient?.close();
        console.log(JSON.stringify(wideEvent));
      }
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      onError: (error) =>
        JSON.stringify({
          error:
            error instanceof Error ? error.message : "Internal Server Error",
          detail: getErrorDetail(error)
        })
    });
  } catch (error) {
    wideEvent.status = "error";
    wideEvent.error = {
      error: error instanceof Error ? error.message : "Internal Server Error",
      detail: getErrorDetail(error),
      provider: wideEvent.llm?.provider,
      model: wideEvent.llm?.model
    };

    try {
      await mcpClient?.close();
    } catch {}

    console.error(JSON.stringify(wideEvent));

    // The provider and model are logged, not shown to the user
    const { provider, model, ...userError } = wideEvent.error;
    return new Response(JSON.stringify(userError), {
      status: error instanceof HttpError ? error.status : 500,
      headers: {
        "content-type": "application/json"
      }
    });
  }
}
