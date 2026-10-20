/**
 * Main content area for subject access, with resource-kind tabs, loading/empty
 * states and a read-only effective-access matrix whose cells explain themselves.
 */
import { SubjectAccessReviewAction } from "@flanksource-ui/api/services/rbac";
import EffectiveMatrixCell from "@flanksource-ui/components/Permissions/SubjectPermissions/EffectiveMatrixCell";
import PermissionsMatrixTable from "@flanksource-ui/components/Permissions/SubjectPermissions/PermissionsMatrixTable";
import {
  AccessTab,
  EffectiveAccessMap,
  EffectiveState,
  GLOBAL_ACTIONS,
  PermissionResource,
  RESOURCE_KIND_CONFIG,
  ResourceTypeGroup,
  getResourceActionKey
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@flanksource-ui/components/ui/tabs";
import { ReactNode, RefObject } from "react";

type SubjectPermissionsMatrixContentProps = {
  loading: boolean;
  groupedResources: ResourceTypeGroup[];
  activeTab: AccessTab;
  visibleTabs: AccessTab[];
  tabCounts: Partial<Record<AccessTab, number>>;
  effectiveAccessByAction: EffectiveAccessMap;
  globalAccess: Partial<Record<SubjectAccessReviewAction, EffectiveState>>;
  isLoadingGlobalAccess: boolean;
  isCheckingEffectiveAccess: boolean;
  scrollRef: RefObject<HTMLDivElement>;
  toolbar?: ReactNode;
  footnote?: ReactNode;
  onSelectTab: (tab: AccessTab) => void;
  onExplainResource: (resource: PermissionResource, action: string) => void;
  onExplainGlobal: (action: SubjectAccessReviewAction) => void;
};

export default function SubjectPermissionsMatrixContent({
  loading,
  groupedResources,
  activeTab,
  visibleTabs,
  tabCounts,
  effectiveAccessByAction,
  globalAccess,
  isLoadingGlobalAccess,
  isCheckingEffectiveAccess,
  scrollRef,
  toolbar,
  footnote,
  onSelectTab,
  onExplainResource,
  onExplainGlobal
}: SubjectPermissionsMatrixContentProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <Tabs
          value={activeTab}
          onValueChange={(value) => onSelectTab(value as AccessTab)}
        >
          <TabsList>
            {visibleTabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab === "global" ? "Global" : RESOURCE_KIND_CONFIG[tab].label}{" "}
                ({tabCounts[tab] ?? 0})
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
        {toolbar ? <div className="ml-auto">{toolbar}</div> : null}
      </div>

      <div ref={scrollRef} className="pr-1">
        {activeTab === "global" && isLoadingGlobalAccess ? (
          <div className="flex items-center gap-2 rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            Reviewing actions without a resource...
          </div>
        ) : activeTab === "global" ? (
          <GlobalActionsTable
            access={globalAccess}
            onExplain={onExplainGlobal}
          />
        ) : loading ? (
          <div className="flex items-center gap-2 rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            Loading subject access...
          </div>
        ) : groupedResources.length === 0 ? (
          <div className="rounded-md border border-dashed border-gray-200 p-6 text-sm text-gray-500">
            No resources match the current filters.
          </div>
        ) : (
          <div className="space-y-3">
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
                          label={`Why ${action} on ${resource.displayName}?`}
                          onClick={() => onExplainResource(resource, action)}
                        />
                      );
                    }}
                  />
                </div>
              </section>
            ))}
            {footnote ? (
              <p className="text-xs text-gray-500">{footnote}</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function GlobalActionsTable({
  access,
  onExplain
}: {
  access: Partial<Record<SubjectAccessReviewAction, EffectiveState>>;
  onExplain: (action: SubjectAccessReviewAction) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border border-gray-200 bg-white">
        <table className="w-full table-auto border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
              <th className="border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Allows
              </th>
              <th className="border-b border-gray-200 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Access
              </th>
            </tr>
          </thead>
          <tbody>
            {GLOBAL_ACTIONS.map(({ action, description }) => (
              <tr key={action}>
                <td className="whitespace-nowrap border-b border-gray-200 px-3 py-2">
                  <code className="text-sm text-gray-900">{action}</code>
                </td>
                <td className="border-b border-gray-200 px-3 py-2 text-sm text-gray-600">
                  {description}
                </td>
                <td className="border-b border-gray-200 px-3 py-2 text-center">
                  <EffectiveMatrixCell
                    state={access[action] ?? "unknown"}
                    label={`Why ${action}?`}
                    onClick={() => onExplain(action)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">
        These actions aren&apos;t performed on a resource. A Role grants them
        with a rule that names no Scope.
      </p>
    </div>
  );
}
