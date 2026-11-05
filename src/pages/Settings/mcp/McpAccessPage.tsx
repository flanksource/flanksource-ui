import McpSubjectAccessList, {
  MCP_USE_CHECK
} from "@flanksource-ui/components/MCP/McpSubjectAccessList";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";

// McpAccessPage lists who may use MCP at all: the MCP server checks mcp:use on every connection.
export default function McpAccessPage() {
  return (
    <McpTabsLinks activeTab="Access">
      <div className="flex h-full min-h-0 w-full flex-1 flex-col p-6 pb-3 lg:max-w-4xl">
        <McpSubjectAccessList check={MCP_USE_CHECK} />
      </div>
    </McpTabsLinks>
  );
}
