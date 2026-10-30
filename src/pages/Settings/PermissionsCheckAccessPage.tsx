import { SubjectAccessReviewAction } from "@flanksource-ui/api/services/rbac";
import PermissionsTabsLinks from "@flanksource-ui/components/Permissions/PermissionsTabsLinks";
import {
  PermissionAccessCheckConfig,
  PermissionAccessCheckForm
} from "@flanksource-ui/components/Permissions/PermissionAccessCheckModal";

const accessCheckActions: SubjectAccessReviewAction[] = ["mcp:run", "mcp:use"];

const accessCheckConfig: PermissionAccessCheckConfig = {
  actions: accessCheckActions,
  allowedResourceTypes: ["playbook", "view"],
  hideResourceForActions: ["mcp:use"],
  resourceOverrideByAction: {
    "mcp:use": {
      global: "mcp"
    }
  }
};

export function PermissionsCheckAccessPage() {
  return (
    <PermissionsTabsLinks activeTab="Check Access">
      <div className="w-full max-w-3xl space-y-4 p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Check Access</h3>
          <p className="text-sm text-gray-600">
            Check whether a subject may perform an action. The check evaluates
            the final effective access across all Roles and RoleBindings,
            whether they were created in the UI or from Kubernetes resources.
          </p>
        </div>

        <PermissionAccessCheckForm config={accessCheckConfig} />
      </div>
    </PermissionsTabsLinks>
  );
}
