import { tool, zodSchema, type TextStreamPart } from "ai";
import { z } from "zod";
import { TRUNCATION_MARKER } from "@flanksource-ui/components/ai/mcp-utils";

// flanksource.com/llms.txt is about 57k characters (~12,500 tokens)
// https://platform.openai.com/tokenizer
export const TOOL_OUTPUT_CHAR_LIMIT = 65_000;

/**
 * Truncate a tool output string to TOOL_OUTPUT_CHAR_LIMIT characters.
 * Returns the original string unchanged if within the limit.
 * Otherwise returns a truncated version with a clear warning header.
 */
export function truncateToolOutput(
  serialized: string,
  limit: number = TOOL_OUTPUT_CHAR_LIMIT
): string {
  if (serialized.length <= limit) {
    return serialized;
  }

  const header = `${TRUNCATION_MARKER} to ${limit} characters (original: ${serialized.length}).\n\n`;
  return header + serialized.slice(0, limit);
}

/**
 * Stream transform that intercepts final tool-result chunks and truncates
 * oversized outputs. Because this sits in the stream pipeline, the truncated
 * value is what the UI receives, what gets stored in step history, AND what
 * the next LLM step sees — guaranteeing no mismatch.
 *
 * Preliminary (streaming) tool-result chunks are passed through untouched;
 * only the final chunk (preliminary !== true) is truncated.
 */
export function truncateToolResultTransform() {
  return new TransformStream<TextStreamPart<any>, TextStreamPart<any>>({
    transform(chunk, controller) {
      if (chunk.type === "tool-result" && !chunk.preliminary) {
        const serialized = JSON.stringify(chunk.output);
        const truncated = truncateToolOutput(serialized);
        if (truncated !== serialized) {
          controller.enqueue({ ...chunk, output: truncated });
          return;
        }
      }
      controller.enqueue(chunk);
    }
  });
}

const NATIVE_TOOLS_WITH_NO_APPROVAL_REQUIRED: string[] = [
  "run_template",

  "search_catalog",
  "search_catalog_changes",
  "describe_catalog",
  "list_catalog_types",
  "get_related_configs",

  "list_connections",

  "search_health_checks",
  "get_check_status",
  "list_all_checks",

  "get_playbook_run_steps",
  "get_playbook_failed_runs",
  "get_playbook_recent_runs",
  "get_all_playbooks",

  "get_notifications_for_resource",
  "get_notification_detail",
  "read_artifact_metadata"
] as const;

// Tool names for playbooks are dependent on the namespace the playbooks are installed.
// That's why, for playbooks, we use toolDefinition.title instead of the tool name
// which would look something like (web_request_default)
// where `web_request` is the .metadata.name
// and, `default` is the .metadata.namespace
const PLAYBOOK_MCP_TOOLS_WITH_NO_APPROVAL_REQUIRED: string[] = [
  "curl",
  "kubectl"
];

type McpTool = Record<string, any>;
type McpTools = Record<string, McpTool>;

function wrapMcpToolsWithApproval(
  mcpTools: McpTools,
  alwaysAllowedTools: string[] = []
): McpTools {
  const alwaysAllowed = new Set(alwaysAllowedTools);
  const tools = Object.entries(mcpTools).map(
    ([name, toolDefinition]: [string, McpTool]) => {
      const noApproval =
        NATIVE_TOOLS_WITH_NO_APPROVAL_REQUIRED.includes(name) ||
        alwaysAllowed.has(name) ||
        (toolDefinition["title"] &&
          PLAYBOOK_MCP_TOOLS_WITH_NO_APPROVAL_REQUIRED.includes(
            toolDefinition["title"]
          )) ||
        name.startsWith("view_"); // views are read-only, so they can be auto-approved

      return [
        name,
        {
          ...toolDefinition,
          needsApproval: !noApproval
        }
      ];
    }
  );

  return Object.fromEntries(tools);
}

function createPlotTimeseriesTool() {
  return tool({
    description:
      "Plot a time series using timestamped numeric values provided by the user.",
    needsApproval: false,
    inputSchema: zodSchema(
      z.object({
        timeseries: z
          .array(
            z.object({
              timestamp: z
                .string()
                .describe("Timestamp in ISO-8601 format for the data point"),
              value: z.number().describe("Numeric value at the timestamp")
            })
          )
          .min(1)
          .describe("Ordered list of data points to visualize")
      })
    ),
    outputSchema: zodSchema(
      z.object({
        kind: z.literal("plot_timeseries"),
        timeseries: z.array(
          z.object({
            timestamp: z.string(),
            value: z.number()
          })
        ),
        title: z.string().optional()
      })
    ),
    execute: async ({ timeseries }) => {
      return {
        kind: "plot_timeseries",
        timeseries,
        title: "Timeseries"
      };
    }
  });
}

export async function buildChatTools(
  mcpClient: {
    tools: () => Promise<McpTools>;
  },
  alwaysAllowedTools: string[] = []
) {
  const mcpTools = await mcpClient.tools();
  const toolsWithApproval = wrapMcpToolsWithApproval(
    mcpTools,
    alwaysAllowedTools
  );

  return {
    ...toolsWithApproval,
    plot_timeseries: createPlotTimeseriesTool()
  };
}
