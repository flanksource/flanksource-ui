import { fetchMcpRunPermissions } from "@flanksource-ui/api/services/permissions";
import { getAllViews } from "@flanksource-ui/api/services/views";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import { useMcpResourcePermissions } from "@flanksource-ui/lib/permissions/useMcpResourcePermissions";
import ResourceAccessCard from "@flanksource-ui/components/Permissions/ResourceAccessCard";
import SubjectSelectorPanel from "@flanksource-ui/components/Permissions/SubjectSelectorPanel";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

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
    setSelectiveSubjectAccess,
    isSettingSelectiveSubjectAccess,
    mutatingSubjectId,
    loading,
    isInitialLoading,
    preselectedSubjectAccess,
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

  const [isSubjectPanelSwitching, setIsSubjectPanelSwitching] = useState(false);

  useEffect(() => {
    if (!selectedView) {
      setIsSubjectPanelSwitching(false);
      return;
    }

    // SubjectSelectorPanel remounts when the selected view changes (key={selectedView.id}).
    // Keep this overlay on briefly so the switch feels intentional instead of a flicker.
    setIsSubjectPanelSwitching(true);
    const timer = setTimeout(() => {
      setIsSubjectPanelSwitching(false);
    }, 220);

    return () => {
      clearTimeout(timer);
    };
  }, [selectedView?.id]);

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
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-3 lg:max-w-3xl [&>*+*]:border-t [&>*+*]:border-gray-200 [&>*]:pb-2 [&>*]:pt-2">
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
                  isSelected={selectedView?.id === view.id}
                  onGlobalOverrideChange={(override) =>
                    setGlobalOverride(view, override)
                  }
                  onViewSubjects={() => setSelectedResourceId(view.id)}
                />
              );
            })}
          </div>

          {/* Keep a stable right-column width/height for both states so layout doesn't jump. */}
          <div className="min-h-0 w-full shrink-0 lg:w-[420px]">
            {selectedView ? (
              <div className="relative h-full">
                <SubjectSelectorPanel
                  key={selectedView.id}
                  description="Select users, teams, groups, or roles to manage view access for MCP usage."
                  preselectedSubjectAccess={preselectedSubjectAccess}
                  isSubmitting={isSettingSelectiveSubjectAccess}
                  mutatingSubjectId={mutatingSubjectId}
                  onClose={() => setSelectedResourceId(null)}
                  onSetSubjectAccess={(subject, access) =>
                    setSelectiveSubjectAccess(selectedView, subject, access)
                  }
                />

                {isSubjectPanelSwitching ? (
                  <div className="pointer-events-none absolute inset-0 z-10 rounded-md bg-white/20 backdrop-blur-[1.5px]" />
                ) : null}
              </div>
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
