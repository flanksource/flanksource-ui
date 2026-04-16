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

type LLMConnection = {
  type: "anthropic" | "openai";
  password?: string;
  properties?: {
    model?: string;
  };
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

async function fetchLLMConnection(backendUrl: string, cookies: string) {
  const url = buildURL(backendUrl, "/connection/llm").toString();
  const response = await fetch(url, {
    headers: {
      Cookie: cookies
    },
    next: {
      revalidate: 5 * 60 // cache for 5 minutes
    }
  });

  if (!response.ok) {
    const bodyText = await response.text();
    if (response.status === 404) {
      throw new HttpError("LLM connection not found", 404, bodyText);
    }

    throw new HttpError(
      `failed to load LLM config: ${response.status}`,
      response.status,
      bodyText
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  const bodyText = await response.text();
  if (!contentType.includes("application/json")) {
    const snippet = bodyText.slice(0, 2000);
    throw new Error(
      `LLM config response is not JSON (status ${response.status}, content-type ${contentType}). Body: ${snippet}`
    );
  }

  try {
    return JSON.parse(bodyText) as LLMConnection;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const snippet = bodyText.slice(0, 2000);
    throw new Error(
      `LLM config response is invalid JSON (status ${response.status}): ${message}. Body: ${snippet}`
    );
  }
}

function resolveModelId(connection: LLMConnection) {
  const model = connection.properties?.model;
  return typeof model === "string" && model.length > 0 ? model : undefined;
}

function buildLLMModel(connection: LLMConnection): LanguageModelV3 {
  const modelId = resolveModelId(connection);

  switch (connection.type) {
    case "anthropic": {
      const anthropicProvider = createAnthropic({
        apiKey: connection.password ?? ""
      });
      return anthropicProvider(modelId ?? "claude-haiku-4-5");
    }
    case "openai": {
      const openaiProvider = createOpenAI({
        apiKey: connection.password ?? ""
      });
      return openaiProvider(modelId ?? "gpt-4.1");
    }
    default:
      throw new Error(`Unsupported LLM type: ${connection.type}`);
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

    const llmConnection = await fetchLLMConnection(backendUrl, cookies);
    wideEvent.llm = {
      model: llmConnection.properties?.model,
      provider: llmConnection.type
    };

    const model = buildLLMModel(llmConnection);

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
          detail: getErrorDetail(error),
          provider: wideEvent.llm?.provider,
          model: wideEvent.llm?.model
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

    return new Response(JSON.stringify(wideEvent.error), {
      status: error instanceof HttpError ? error.status : 500,
      headers: {
        "content-type": "application/json"
      }
    });
  }
}
