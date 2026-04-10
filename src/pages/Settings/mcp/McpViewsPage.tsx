import { fetchMcpRunPermissions } from "@flanksource-ui/api/services/permissions";
import { getAllViews } from "@flanksource-ui/api/services/views";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import SubjectSelectorPanel, {
  SubjectAccess
} from "@flanksource-ui/components/Permissions/SubjectSelectorPanel";
import { Input } from "@flanksource-ui/components/ui/input";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { useMcpResourcePermissions } from "@flanksource-ui/lib/permissions/useMcpResourcePermissions";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
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
    globalOverrideByResource,
    selectedResource: selectedView,
    setSelectedResourceId,
    mutatingResourceId,
    setGlobalOverride,
    setSelectiveSubjectAccess,
    isSettingSelectiveSubjectAccess,
    mutatingSubjectId,
    allowSelectiveAccess,
    isAllowingSelective,
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
  const [viewSearch, setViewSearch] = useState("");

  const debouncedSearch = useDebouncedValue(viewSearch, 200) ?? "";

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

  const groupedViews = useMemo(() => {
    const grouped = new Map<string, typeof views>();
    const loweredSearch = debouncedSearch.trim().toLowerCase();

    for (const view of views) {
      const displayName = view.spec?.title || view.name;
      const group = view.namespace?.trim() || "Global";
      const haystack = `${displayName} ${view.namespace || ""}`.toLowerCase();

      if (loweredSearch && !haystack.includes(loweredSearch)) {
        continue;
      }

      const list = grouped.get(group) ?? [];
      list.push(view);
      grouped.set(group, list);
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      )
      .map(([group, groupedItems]) => ({
        group,
        views: groupedItems.sort((a, b) =>
          (a.spec?.title || a.name).localeCompare(
            b.spec?.title || b.name,
            undefined,
            {
              sensitivity: "base"
            }
          )
        )
      }));
  }, [debouncedSearch, views]);

  const visibleViews = useMemo(
    () => groupedViews.flatMap((group) => group.views),
    [groupedViews]
  );

  useEffect(() => {
    if (
      selectedView?.id &&
      visibleViews.some((view) => view.id === selectedView.id)
    ) {
      return;
    }

    setSelectedResourceId(visibleViews[0]?.id ?? null);
  }, [selectedView?.id, setSelectedResourceId, visibleViews]);

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

        <div className="flex min-h-0 flex-1 gap-4">
          <div className="flex w-[320px] shrink-0 flex-col">
            <Input
              placeholder="Search views..."
              value={viewSearch}
              onChange={(event) => setViewSearch(event.target.value)}
            />

            <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto">
              {groupedViews.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-gray-500">
                  No views found
                </div>
              ) : (
                groupedViews.map((group) => (
                  <div key={group.group} className="space-y-1">
                    <div className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {group.group}
                    </div>

                    {group.views.map((view) => {
                      const isActive = selectedView?.id === view.id;

                      return (
                        <button
                          key={view.id}
                          type="button"
                          onClick={() => setSelectedResourceId(view.id)}
                          className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-800"
                              : "text-gray-800 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
                            <Icon
                              name={view.spec?.icon || "workflow"}
                              className="h-3 w-3"
                            />
                          </span>
                          <span className="truncate">
                            {view.spec?.title || view.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Keep a stable right-column width/height for both states so layout doesn't jump. */}
          <div className="min-h-0 min-w-0 flex-1 lg:max-w-3xl">
            {selectedView ? (
              <div className="relative h-full">
                <SubjectSelectorPanel
                  key={selectedView.id}
                  headerEntity={{
                    name: selectedView.spec?.title || selectedView.name,
                    icon: selectedView.spec?.icon || "workflow"
                  }}
                  preselectedSubjectAccess={preselectedSubjectAccess}
                  bulkAccess={
                    (globalOverrideByResource.get(selectedView.id) === "allow"
                      ? "allow"
                      : globalOverrideByResource.get(selectedView.id) === "deny"
                        ? "deny"
                        : "default") as SubjectAccess
                  }
                  isSubmitting={
                    isSettingSelectiveSubjectAccess || isAllowingSelective
                  }
                  isBulkSubmitting={mutatingResourceId === selectedView.id}
                  mutatingSubjectId={mutatingSubjectId}
                  onSetBulkAccess={(access) =>
                    setGlobalOverride(
                      selectedView,
                      access === "allow"
                        ? "allow"
                        : access === "deny"
                          ? "deny"
                          : "none"
                    )
                  }
                  onSetSubjectAccess={(subject, access) =>
                    setSelectiveSubjectAccess(selectedView, subject, access)
                  }
                  onSetManySubjectAccess={(selections) =>
                    allowSelectiveAccess(selectedView, selections)
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
