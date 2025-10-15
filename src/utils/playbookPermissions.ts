import { Permission } from "@flanksource-ui/context";

/**
 * Checks if the user has any playbook:run permission
 * @param permissions - Array of permissions from the user context
 * @returns true if user has at least one playbook:run permission that is not denied
 */
export function hasPlaybookRunPermission(permissions: Permission[]): boolean {
  return permissions.some(
    (permission) =>
      permission.action === "playbook:run" && permission.deny !== true
  );
}
