import { fetchMcpRunPermissions } from "@flanksource-ui/api/services/permissions";
import { getAllViews } from "@flanksource-ui/api/services/views";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import { useMcpResourcePermissions } from "@flanksource-ui/lib/permissions/useMcpResourcePermissions";
import ResourceAccessCard from "@flanksource-ui/components/Permissions/ResourceAccessCard";
import SubjectSelectorPanel from "@flanksource-ui/components/Permissions/SubjectSelectorPanel";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const getViewRefs = (permission: PermissionsSummary) =>
  permission.object_selector?.views ?? [];

export default function McpViewsPage() {
  const {
    isLoading,
    data: viewsResponse,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ["mcp", "views", "all"],
    queryFn: async () => getAllViews([{ id: "name", desc: false }], 0, 1000)
  });

  const views = useMemo(() => viewsResponse?.data ?? [], [viewsResponse?.data]);

  const {
    permissionsByResource,
    globalOverrideByResource,
    selectedResource: selectedView,
    setSelectedResourceId,
    mutatingResourceId,
    setGlobalOverride,
    allowSelectiveAccess,
    isAllowingSelective,
    loading,
    isInitialLoading,
    preselectedSubjectIds,
    refetch: refetchAll
  } = useMcpResourcePermissions({
    resources: views,
    isResourcesLoading: isLoading,
    isResourcesRefetching: isRefetching,
    refetchResources: refetch,
    permissionsQueryKey: ["mcp", "views", "permissions"],
    fetchPermissions: fetchMcpRunPermissions,
    getRefs: getViewRefs,
    objectSelectorKey: "views"
  });

  return (
    <McpTabsLinks
      activeTab="Views"
      loading={loading}
      isInitialLoading={isInitialLoading}
      loadingText="Loading MCP views..."
      onRefresh={refetchAll}
    >
      <div className="flex h-full w-full flex-1 flex-col gap-4 p-6 pb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            View permissions
          </h3>
          <p className="text-sm text-gray-600">
            Control which views MCP clients can invoke through this gateway.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-3 lg:max-w-3xl [&>*+*]:border-t [&>*+*]:border-gray-200 [&>*+*]:pt-2 [&>*]:pb-2">
            {views.map((view) => {
              return (
                <ResourceAccessCard
                  key={view.id}
                  entity={{
                    id: view.id,
                    name: view.spec?.title || view.name,
                    namespace: view.namespace,
                    icon: view.spec?.icon || "workflow"
                  }}
                  globalOverride={
                    globalOverrideByResource.get(view.id) ?? "none"
                  }
                  isMutating={mutatingResourceId === view.id}
                  onGlobalOverrideChange={(override) =>
                    setGlobalOverride(view, override)
                  }
                  onViewSubjects={() => setSelectedResourceId(view.id)}
                />
              );
            })}
          </div>

          <div className="min-h-0 w-full shrink-0 lg:w-[420px]">
            {selectedView ? (
              <SubjectSelectorPanel
                key={selectedView.id}
                description="Select users, teams, groups, or roles to allow this view for MCP usage."
                preselectedSubjectIds={preselectedSubjectIds}
                isSubmitting={isAllowingSelective}
                onClose={() => setSelectedResourceId(null)}
                onAllow={(subjects) =>
                  allowSelectiveAccess(selectedView, subjects)
                }
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                Select a view row to manage custom subject access.
              </div>
            )}
          </div>
        </div>
      </div>
    </McpTabsLinks>
  );
}
