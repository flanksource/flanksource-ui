import { SubjectAccessReviewAction } from "@flanksource-ui/api/services/rbac";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import {
  PermissionAccessCheckConfig,
  PermissionAccessCheckForm
} from "@flanksource-ui/components/Permissions/PermissionAccessCheckModal";

const mcpAccessCheckActions: SubjectAccessReviewAction[] = [
  "mcp:run",
  "mcp:use"
];

const mcpAccessCheckConfig: PermissionAccessCheckConfig = {
  actions: mcpAccessCheckActions,
  title: "MCP Access Check",
  description:
    "Select a subject and action to check MCP access. Resource is required for mcp:run and fixed to MCP for mcp:use.",
  allowedResourceTypes: ["playbook", "view"],
  hideResourceForActions: ["mcp:use"],
  resourceOverrideByAction: {
    "mcp:use": {
      global: "mcp"
    }
  }
};

export default function McpCheckAccessPage() {
  return (
    <McpTabsLinks activeTab="Check Access" loadingText="Loading resources...">
      <div className="w-full max-w-3xl space-y-4 p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Check Access</h3>
          <p className="text-sm text-gray-600">
            Validate whether a subject can invoke MCP resources.
          </p>
        </div>

        <PermissionAccessCheckForm config={mcpAccessCheckConfig} />
      </div>
    </McpTabsLinks>
  );
}
