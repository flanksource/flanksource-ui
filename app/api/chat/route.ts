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
import { buildChatTools } from "./tools";

type LLMConnection = {
  type: "anthropic" | "openai";
  password?: string;
  properties?: {
    model?: string;
  };
};

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
    throw new Error(`failed to load LLM config: ${response.status}`);
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

export async function POST(req: Request) {
  const wideEvent: Record<string, any> = {
    event: "llm-conversation",
    timestamp: new Date().toISOString(),
    status: "started"
  };

  const { messages }: { messages?: UIMessage[] } = await req.json();
  if (!Array.isArray(messages)) {
    return new Response("Invalid request body", { status: 400 });
  }

  wideEvent.messages = messages.length;

  try {
    const backendUrl = await getBackendUrl();
    wideEvent.backendURL = backendUrl;

    const cookies = req.headers.get("cookie") ?? "";
    wideEvent.cookies = cookies.length;

    const llmConnection = await fetchLLMConnection(backendUrl, cookies);
    const model = buildLLMModel(llmConnection);
    wideEvent.llm = {
      model: llmConnection.properties?.model,
      provider: llmConnection.type
    };

    const modelMessages = await convertToModelMessages(messages);
    const mcpClient = await createMCPClient({
      transport: {
        type: "http",
        url: buildURL(backendUrl, "/mcp").toString(),
        headers: {
          // Use the user's cookie to authenticate for now.
          // We need to add the more fine-grained MCP tokens
          Cookie: cookies
        }
      }
    });
    const tools = await buildChatTools(mcpClient);

    const result = streamText({
      model,
      messages: modelMessages,
      tools,
      system: "Answer concisely",
      stopWhen: stepCountIs(20),
      onError: async (error) => {
        wideEvent.status = "error";
        wideEvent.error =
          error instanceof Error ? error.message : String(error);
        await mcpClient?.close();
      },
      onFinish: async (result) => {
        wideEvent.status = "completed";
        wideEvent.usage = {
          totalTokens: result.usage?.totalTokens
        };
        wideEvent.finishReason = result.finishReason;
        await mcpClient?.close();
      }
    });

    return result.toUIMessageStreamResponse({ sendReasoning: true });
  } catch (error) {
    wideEvent.status = "error";
    wideEvent.error = error instanceof Error ? error.message : String(error);
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    if (wideEvent.status === "error") {
      console.error(JSON.stringify(wideEvent));
    } else {
      console.log(JSON.stringify(wideEvent));
    }
  }
}
