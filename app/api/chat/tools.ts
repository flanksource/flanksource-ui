import { tool, zodSchema } from "ai";
import { z } from "zod";

const TOOLS_WITH_NO_APPROVAL_REQUIRED: string[] = [
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

type McpTool = Record<string, any>;
type McpTools = Record<string, McpTool>;

function wrapMcpToolsWithApproval(mcpTools: McpTools): McpTools {
  const tools = Object.entries(mcpTools).map(
    ([name, toolDefinition]: [string, McpTool]) => {
      const noApproval =
        TOOLS_WITH_NO_APPROVAL_REQUIRED.includes(name) ||
        name.startsWith("view_");

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

export async function buildChatTools(mcpClient: {
  tools: () => Promise<McpTools>;
}) {
  const mcpTools = await mcpClient.tools();
  const toolsWithApproval = wrapMcpToolsWithApproval(mcpTools);

  return {
    ...toolsWithApproval,
    plot_timeseries: createPlotTimeseriesTool()
  };
}
