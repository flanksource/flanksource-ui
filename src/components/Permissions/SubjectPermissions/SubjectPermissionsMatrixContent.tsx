/**
 * Main content area for subject access, with resource-kind tabs, loading/empty
 * states and a read-only effective-access matrix.
 */
import EffectiveMatrixCell from "@flanksource-ui/components/Permissions/SubjectPermissions/EffectiveMatrixCell";
import PermissionsMatrixTable from "@flanksource-ui/components/Permissions/SubjectPermissions/PermissionsMatrixTable";
import {
  EffectiveAccessMap,
  RESOURCE_KIND_CONFIG,
  ResourceKind,
  ResourceTypeGroup,
  getResourceActionKey
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
  visibleResourceKinds: ResourceKind[];
  resourceKindCounts: Record<ResourceKind, number>;
  effectiveAccessByAction: EffectiveAccessMap;
  isCheckingEffectiveAccess: boolean;
  scrollRef: RefObject<HTMLDivElement>;
  onSelectResourceKind: (kind: ResourceKind) => void;
};

export default function SubjectPermissionsMatrixContent({
  loading,
  groupedResources,
  activeResourceKind,
  visibleResourceKinds,
  resourceKindCounts,
  effectiveAccessByAction,
  isCheckingEffectiveAccess,
  scrollRef,
  onSelectResourceKind
}: SubjectPermissionsMatrixContentProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex items-center gap-2">
        <Tabs
          value={activeResourceKind}
          onValueChange={(value) => onSelectResourceKind(value as ResourceKind)}
        >
          <TabsList>
            {visibleResourceKinds.map((kind) => (
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

      <div ref={scrollRef} className="pr-1">
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
              <section key={group.key}>
                <div className="rounded-md border border-gray-200 bg-white">
                  <PermissionsMatrixTable
                    actions={group.actions}
                    rows={group.resources}
                    renderCell={(resource, action) => {
                      if (!resource.actions.includes(action)) {
                        return <span className="text-xs text-gray-300">—</span>;
                      }

                      return (
                        <EffectiveMatrixCell
                          state={
                            effectiveAccessByAction[
                              getResourceActionKey(resource, action)
                            ] ?? "unknown"
                          }
                        />
                      );
                    }}
                  />
                </div>
              </section>
            ))}
            {activeResourceKind === "playbook" ? (
              <p className="text-xs text-gray-500">
                * Without a target: rules that only allow runs on target
                configs, components or checks aren&apos;t counted.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
