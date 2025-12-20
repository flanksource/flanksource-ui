import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage
} from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV3 } from "@ai-sdk/provider";
import {
  experimental_createMCPClient as createMCPClient,
  experimental_MCPClient as MCPClient
} from "@ai-sdk/mcp";
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

async function fetchLLMConnection(backendUrl: string, cookieHeader: string) {
  const url = new URL("/connection/llm", backendUrl).toString();
  const response = await fetch(url, {
    headers: {
      Cookie: cookieHeader
    },
    next: {
      revalidate: 5 * 60 // cache for 5 minutes
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load LLM config: ${response.status}`);
  }

  return (await response.json()) as LLMConnection;
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
  const { messages }: { messages?: UIMessage[] } = await req.json();
  if (!Array.isArray(messages)) {
    return new Response("Invalid request body", { status: 400 });
  }

  let mcpClient: MCPClient;
  try {
    const backendUrl = await getBackendUrl();
    const cookieHeader = req.headers.get("cookie") ?? "";
    const llmConnection = await fetchLLMConnection(backendUrl, cookieHeader);
    const model = buildLLMModel(llmConnection);
    const modelMessages = await convertToModelMessages(messages);

    mcpClient = await createMCPClient({
      transport: {
        type: "http",
        url: new URL("/mcp", backendUrl).toString(),
        headers: {
          // Use the user's cookie to authenticate for now.
          // We need to add the more fine-grained MCP tokens
          Cookie: cookieHeader
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
        console.error("Error during streaming:", error);
        await mcpClient?.close();
      },
      onFinish: async () => {
        await mcpClient?.close();
      }
    });

    return result.toUIMessageStreamResponse({ sendReasoning: true });
  } catch (error) {
    console.error("Error handling chat request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
