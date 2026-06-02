/**
 * Collapsible plugin permissions card used by the subject permissions workbench.
 *
 * Unlike playbooks, views, and connections, plugins expose dynamic operation
 * sets, so a matrix/table layout does not scale well. This component renders a
 * single plugin as an accordion summary plus a vertical operation list, where
 * each operation can be assigned direct allow/deny/default access.
 */
import MatrixDrawer from "@flanksource-ui/components/Permissions/SubjectPermissions/MatrixDrawer";
import {
  AccessValue,
  DEFAULT_DIRECT_STATE,
  DirectAccessState,
  PermissionResource,
  getDisplayActionForPermission,
  getResourceActionKey
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useState } from "react";
import { HiPuzzle } from "react-icons/hi";

type PluginPermissionsAccordionProps = {
  resource: PermissionResource;
  directAccessByResourceAction: Record<string, DirectAccessState>;
  isSubmitting: boolean;
  onPermissionAccessChange: (
    resource: PermissionResource,
    action: string,
    access: AccessValue
  ) => void;
};

function PermissionResourceIcon({
  resource
}: {
  resource: PermissionResource;
}) {
  if (resource.icon === "plugin") {
    return <HiPuzzle className="h-4 w-4 shrink-0 text-gray-500" />;
  }

  return (
    <Icon
      name={resource.icon || "database"}
      className="h-4 w-4 shrink-0 text-gray-500"
    />
  );
}

function getPluginAccessCounts(
  resource: PermissionResource,
  directAccessByResourceAction: Record<string, DirectAccessState>
) {
  return resource.actions.reduce(
    (counts, action) => {
      const key = getResourceActionKey(resource, action);
      const direct = directAccessByResourceAction[key] ?? DEFAULT_DIRECT_STATE;
      counts[direct.access] += 1;
      return counts;
    },
    { allow: 0, deny: 0, default: 0 } as Record<AccessValue, number>
  );
}

export default function PluginPermissionsAccordion({
  resource,
  directAccessByResourceAction,
  isSubmitting,
  onPermissionAccessChange
}: PluginPermissionsAccordionProps) {
  const accessCounts = getPluginAccessCounts(
    resource,
    directAccessByResourceAction
  );

  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="rounded-md border border-gray-200 bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <div className="flex min-w-0 items-center gap-2">
          <PermissionResourceIcon resource={resource} />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-gray-900">
              {resource.displayName}
            </div>
            <div className="text-xs text-gray-500">
              {resource.actions.length} operations
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-xs">
          <span className="text-green-600">{accessCounts.allow} allow</span>
          <span className="text-red-600">{accessCounts.deny} deny</span>
          <span className="text-gray-500">{accessCounts.default} default</span>
          <span
            className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </div>
      </button>

      {isOpen ? (
        <div className="border-t border-gray-200 bg-gray-50/40 py-2">
          {resource.actions.length === 0 ? (
            <div className="px-8 py-2 text-sm text-gray-500">
              No operations exposed by this plugin.
            </div>
          ) : (
            <MatrixDrawer
              rows={resource.actions.map((action) => {
                const key = getResourceActionKey(resource, action);
                const direct =
                  directAccessByResourceAction[key] ?? DEFAULT_DIRECT_STATE;

                return {
                  key: `${resource.id}:${action}`,
                  action: getDisplayActionForPermission(resource, action),
                  access: direct.access,
                  isReadOnly: direct.isReadOnly,
                  isWildcard: direct.isWildcard,
                  disabled: isSubmitting,
                  onChange: (next) => {
                    onPermissionAccessChange(resource, action, next);
                  }
                };
              })}
            />
          )}
        </div>
      ) : null}
    </section>
  );
}
