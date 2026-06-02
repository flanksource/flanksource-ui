/**
 * Main matrix content area for subject permissions, including resource-kind tabs,
 * loading/empty states, effective-access cells, and editable row drawers.
 */
import EffectiveMatrixCell from "@flanksource-ui/components/Permissions/SubjectPermissions/EffectiveMatrixCell";
import MatrixDrawer from "@flanksource-ui/components/Permissions/SubjectPermissions/MatrixDrawer";
import ResourceTypeMatrixSection from "@flanksource-ui/components/Permissions/SubjectPermissions/ResourceTypeMatrixSection";
import {
  AccessValue,
  DEFAULT_DIRECT_STATE,
  DirectAccessState,
  EffectiveAccessMap,
  PermissionResource,
  RESOURCE_KIND_CONFIG,
  RESOURCE_KIND_ORDER,
  ResourceKind,
  ResourceTypeGroup,
  getResourceActionKey,
  isSamePermissionResource
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@flanksource-ui/components/ui/tabs";
import { RefObject } from "react";

type SubjectPermissionsMatrixContentProps = {
  loading: boolean;
  groupedResources: ResourceTypeGroup[];
  activeResourceKind: ResourceKind;
  resourceKindCounts: Record<ResourceKind, number>;
  selectedResource: PermissionResource | null;
  directAccessByResourceAction: Record<string, DirectAccessState>;
  effectiveAccessByAction: EffectiveAccessMap;
  isCheckingEffectiveAccess: boolean;
  isSubmitting: boolean;
  scrollRef: RefObject<HTMLDivElement>;
  onSelectResourceKind: (kind: ResourceKind) => void;
  onToggleResource: (resource: PermissionResource) => void;
  onPermissionAccessChange: (
    resource: PermissionResource,
    action: string,
    access: AccessValue
  ) => void;
};

export default function SubjectPermissionsMatrixContent({
  loading,
  groupedResources,
  activeResourceKind,
  resourceKindCounts,
  selectedResource,
  directAccessByResourceAction,
  effectiveAccessByAction,
  isCheckingEffectiveAccess,
  isSubmitting,
  scrollRef,
  onSelectResourceKind,
  onToggleResource,
  onPermissionAccessChange
}: SubjectPermissionsMatrixContentProps) {
  const isSelectedResource = (resource: PermissionResource) => {
    return isSamePermissionResource(selectedResource, resource);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-4">
      <div className="flex items-center gap-2">
        <Tabs
          value={activeResourceKind}
          onValueChange={(value) => onSelectResourceKind(value as ResourceKind)}
        >
          <TabsList>
            {RESOURCE_KIND_ORDER.map((kind) => (
              <TabsTrigger key={kind} value={kind}>
                {RESOURCE_KIND_CONFIG[kind].label} ({resourceKindCounts[kind]})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {isCheckingEffectiveAccess ? (
          <span
            className="inline-flex h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
            aria-label="Refreshing effective access"
            title="Refreshing effective access"
          />
        ) : null}
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto pr-1">
        {loading ? (
          <div className="flex items-center gap-2 rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            Loading subject access...
          </div>
        ) : groupedResources.length === 0 ? (
          <div className="rounded-md border border-dashed border-gray-200 p-6 text-sm text-gray-500">
            No resources match the current filters.
          </div>
        ) : (
          <div className="space-y-5">
            {groupedResources.map((group) => (
              <ResourceTypeMatrixSection
                key={group.kind}
                actions={group.actions}
                rows={group.resources}
                onRowClick={onToggleResource}
                isRowSelected={(resource) => isSelectedResource(resource)}
                isRowExpanded={(resource) => isSelectedResource(resource)}
                renderExpandedRow={(resource) => (
                  <MatrixDrawer
                    rows={resource.actions.map((action) => {
                      const key = getResourceActionKey(resource, action);
                      const direct =
                        directAccessByResourceAction[key] ??
                        DEFAULT_DIRECT_STATE;

                      return {
                        key: `${resource.id}:${action}`,
                        action,
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
                renderCell={(resource, action) => {
                  if (!resource.actions.includes(action)) {
                    return <span className="text-xs text-gray-300">—</span>;
                  }

                  const key = getResourceActionKey(resource, action);
                  const direct = directAccessByResourceAction[key];

                  if (
                    resource.kind === "plugin" &&
                    direct?.access !== "default"
                  ) {
                    return (
                      <EffectiveMatrixCell
                        state={direct.access === "allow" ? "allowed" : "denied"}
                        notChecked={false}
                      />
                    );
                  }

                  return (
                    <EffectiveMatrixCell
                      state={effectiveAccessByAction[key] ?? "unknown"}
                      notChecked={false}
                    />
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
