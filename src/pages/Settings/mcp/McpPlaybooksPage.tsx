import { getAllPlaybookNames } from "@flanksource-ui/api/services/playbooks";
import McpSubjectAccessList from "@flanksource-ui/components/MCP/McpSubjectAccessList";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import { Input } from "@flanksource-ui/components/ui/input";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useQuery } from "@tanstack/react-query";
import { getErrorMessage } from "@flanksource-ui/api/types/error";
import { useEffect, useMemo, useState } from "react";

export default function McpPlaybooksPage() {
  const {
    data: playbooks = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["mcp", "playbooks", "all"],
    queryFn: getAllPlaybookNames
  });

  const [selectedId, setSelectedResourceId] = useState<string | null>(null);
  const selectedPlaybook = playbooks.find((item) => item.id === selectedId);

  const [playbookSearch, setPlaybookSearch] = useState("");

  const debouncedSearch = useDebouncedValue(playbookSearch, 200) ?? "";

  const groupedPlaybooks = useMemo(() => {
    const grouped = new Map<string, typeof playbooks>();
    const loweredSearch = debouncedSearch.trim().toLowerCase();

    for (const playbook of playbooks) {
      const displayName = playbook.title || playbook.name;
      const haystack =
        `${displayName} ${playbook.namespace || ""} ${playbook.category || ""}`.toLowerCase();

      if (loweredSearch && !haystack.includes(loweredSearch)) {
        continue;
      }

      const category = playbook.category?.trim() || "Other";
      const categoryPlaybooks = grouped.get(category) ?? [];
      categoryPlaybooks.push(playbook);
      grouped.set(category, categoryPlaybooks);
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => {
        if (a === "Other") {
          return 1;
        }
        if (b === "Other") {
          return -1;
        }

        return a.localeCompare(b, undefined, { sensitivity: "base" });
      })
      .map(([category, categoryPlaybooks]) => ({
        category,
        playbooks: categoryPlaybooks.sort((a, b) =>
          (a.title || a.name).localeCompare(b.title || b.name, undefined, {
            sensitivity: "base"
          })
        )
      }));
  }, [debouncedSearch, playbooks]);

  const visiblePlaybooks = useMemo(
    () => groupedPlaybooks.flatMap((group) => group.playbooks),
    [groupedPlaybooks]
  );

  useEffect(() => {
    if (
      selectedPlaybook?.id &&
      visiblePlaybooks.some((playbook) => playbook.id === selectedPlaybook.id)
    ) {
      return;
    }

    setSelectedResourceId(visiblePlaybooks[0]?.id ?? null);
  }, [selectedPlaybook?.id, setSelectedResourceId, visiblePlaybooks]);

  return (
    <McpTabsLinks activeTab="Playbooks">
      <div className="flex h-full w-full flex-1 flex-col gap-4 p-6 pb-6">
        <div className="flex min-h-0 flex-1 gap-4">
          <div className="flex w-[320px] shrink-0 flex-col">
            <Input
              placeholder="Search playbooks..."
              value={playbookSearch}
              onChange={(event) => setPlaybookSearch(event.target.value)}
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
              ) : groupedPlaybooks.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-gray-500">
                  No playbooks found
                </div>
              ) : (
                groupedPlaybooks.map((group) => (
                  <div key={group.category} className="space-y-1">
                    <div className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {group.category}
                    </div>

                    {group.playbooks.map((playbook) => {
                      const isActive = selectedPlaybook?.id === playbook.id;

                      return (
                        <button
                          key={playbook.id}
                          type="button"
                          onClick={() => setSelectedResourceId(playbook.id)}
                          className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors ${
                            isActive
                              ? "bg-blue-50 text-blue-800"
                              : "text-gray-800 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
                            <Icon
                              name={playbook.icon || "playbook"}
                              className="h-3 w-3"
                            />
                          </span>
                          <span className="truncate">
                            {playbook.title || playbook.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="min-h-0 min-w-0 flex-1 lg:max-w-3xl">
            {selectedPlaybook ? (
              <div className="flex h-full min-h-0 flex-col">
                <McpSubjectAccessList
                  key={selectedPlaybook.id}
                  check={{
                    action: "mcp:run",
                    resource: { playbook: selectedPlaybook.id },
                    resourceLabel:
                      selectedPlaybook.title || selectedPlaybook.name
                  }}
                  header={
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                        <Icon
                          name={selectedPlaybook.icon || "playbook"}
                          className="h-4 w-4"
                        />
                      </span>
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {selectedPlaybook.title || selectedPlaybook.name}
                      </div>
                    </div>
                  }
                />
              </div>
            ) : error || isLoading ? null : (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                Select a playbook to see who may run it through MCP.
              </div>
            )}
          </div>
        </div>
      </div>
    </McpTabsLinks>
  );
}
