import { getAllViews } from "@flanksource-ui/api/services/views";
import McpSubjectAccessList from "@flanksource-ui/components/MCP/McpSubjectAccessList";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import { Input } from "@flanksource-ui/components/ui/input";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "@flanksource-ui/api/types/error";
import { useEffect, useMemo, useState } from "react";

export default function McpViewsPage() {
  const {
    isLoading,
    data: viewsResponse,
    error
  } = useQuery({
    queryKey: ["mcp", "views", "all"],
    queryFn: async () => getAllViews([{ id: "name", desc: false }], 0, 1000)
  });

  const views = useMemo(() => viewsResponse?.data ?? [], [viewsResponse?.data]);

  const [selectedId, setSelectedResourceId] = useState<string | null>(null);
  const selectedView = views.find((item) => item.id === selectedId);

  const [viewSearch, setViewSearch] = useState("");

  const debouncedSearch = useDebouncedValue(viewSearch, 200) ?? "";

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
    <McpTabsLinks activeTab="Views">
      <div className="flex h-full w-full flex-1 flex-col gap-4 p-6 pb-6">
        <div className="flex min-h-0 flex-1 gap-4">
          <div className="flex w-[320px] shrink-0 flex-col">
            <Input
              placeholder="Search views..."
              value={viewSearch}
              onChange={(event) => setViewSearch(event.target.value)}
            />

            <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto">
              {error ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {getErrorMessage(error)}
                </div>
              ) : isLoading ? (
                <div className="px-2 py-1.5 text-sm text-gray-500">
                  Loading...
                </div>
              ) : groupedViews.length === 0 ? (
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
              <div className="flex h-full min-h-0 flex-col">
                <McpSubjectAccessList
                  key={selectedView.id}
                  check={{
                    action: "read",
                    resource: { view: selectedView.id },
                    resourceLabel: selectedView.spec?.title || selectedView.name
                  }}
                  requireMcpUse
                  header={
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                        <Icon
                          name={selectedView.spec?.icon || "workflow"}
                          className="h-4 w-4"
                        />
                      </span>
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {selectedView.spec?.title || selectedView.name}
                      </div>
                    </div>
                  }
                />
              </div>
            ) : error || isLoading ? null : (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                Select a view to see who may use it through MCP.
              </div>
            )}
          </div>
        </div>
      </div>
    </McpTabsLinks>
  );
}
