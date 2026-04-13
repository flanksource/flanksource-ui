import { getAllPlaybookNames } from "@flanksource-ui/api/services/playbooks";
import { fetchMcpRunPermissions } from "@flanksource-ui/api/services/permissions";
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

const getPlaybookRefs = (permission: PermissionsSummary) =>
  permission.object_selector?.playbooks ?? [];

export default function McpPlaybooksPage() {
  const {
    data: playbooks = [],
    isLoading,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ["mcp", "playbooks", "all"],
    queryFn: getAllPlaybookNames
  });

  const {
    globalOverrideByResource,
    selectedResource: selectedPlaybook,
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
    resources: playbooks,
    isResourcesLoading: isLoading,
    isResourcesRefetching: isRefetching,
    refetchResources: refetch,
    permissionsQueryKey: ["mcp", "playbooks", "permissions"],
    fetchPermissions: fetchMcpRunPermissions,
    getRefs: getPlaybookRefs,
    objectSelectorKey: "playbooks"
  });

  const [isSubjectPanelSwitching, setIsSubjectPanelSwitching] = useState(false);
  const [playbookSearch, setPlaybookSearch] = useState("");

  const debouncedSearch = useDebouncedValue(playbookSearch, 200) ?? "";

  useEffect(() => {
    if (!selectedPlaybook) {
      setIsSubjectPanelSwitching(false);
      return;
    }

    setIsSubjectPanelSwitching(true);
    const timer = setTimeout(() => {
      setIsSubjectPanelSwitching(false);
    }, 220);

    return () => {
      clearTimeout(timer);
    };
  }, [selectedPlaybook?.id]);

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
    <McpTabsLinks
      activeTab="Playbooks"
      loading={loading}
      isInitialLoading={isInitialLoading}
      loadingText="Loading MCP playbooks..."
      onRefresh={refetchAll}
    >
      <div className="flex h-full w-full flex-1 flex-col gap-4 p-6 pb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Playbook permissions
          </h3>
          <p className="text-sm text-gray-600">
            Control which playbooks MCP clients can invoke through this gateway.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 gap-4">
          <div className="flex w-[320px] shrink-0 flex-col">
            <Input
              placeholder="Search playbooks..."
              value={playbookSearch}
              onChange={(event) => setPlaybookSearch(event.target.value)}
            />

            <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto">
              {groupedPlaybooks.length === 0 ? (
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
              <div className="relative h-full">
                <SubjectSelectorPanel
                  key={selectedPlaybook.id}
                  headerEntity={{
                    name: selectedPlaybook.title || selectedPlaybook.name,
                    icon: selectedPlaybook.icon || "playbook"
                  }}
                  effectiveAccessResource={{
                    id: selectedPlaybook.id,
                    type: "playbook",
                    action: "mcp:run"
                  }}
                  preselectedSubjectAccess={preselectedSubjectAccess}
                  bulkAccess={
                    (globalOverrideByResource.get(selectedPlaybook.id) ===
                    "allow"
                      ? "allow"
                      : globalOverrideByResource.get(selectedPlaybook.id) ===
                          "deny"
                        ? "deny"
                        : "default") as SubjectAccess
                  }
                  isSubmitting={
                    isSettingSelectiveSubjectAccess || isAllowingSelective
                  }
                  isBulkSubmitting={mutatingResourceId === selectedPlaybook.id}
                  mutatingSubjectId={mutatingSubjectId}
                  onSetBulkAccess={(access) =>
                    setGlobalOverride(
                      selectedPlaybook,
                      access === "allow"
                        ? "allow"
                        : access === "deny"
                          ? "deny"
                          : "none"
                    )
                  }
                  onSetSubjectAccess={(subject, access) =>
                    setSelectiveSubjectAccess(selectedPlaybook, subject, access)
                  }
                  onSetManySubjectAccess={(selections) =>
                    allowSelectiveAccess(selectedPlaybook, selections)
                  }
                />

                {isSubjectPanelSwitching ? (
                  <div className="pointer-events-none absolute inset-0 z-10 rounded-md bg-white/20 backdrop-blur-[1.5px]" />
                ) : null}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                Select a playbook row to manage custom subject access.
              </div>
            )}
          </div>
        </div>
      </div>
    </McpTabsLinks>
  );
}
