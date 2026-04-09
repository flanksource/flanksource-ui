import { getAllPlaybookNames } from "@flanksource-ui/api/services/playbooks";
import { fetchMcpRunPermissions } from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import { useMcpResourcePermissions } from "@flanksource-ui/lib/permissions/useMcpResourcePermissions";
import ResourceAccessCard from "@flanksource-ui/components/Permissions/ResourceAccessCard";
import SubjectSelectorPanel from "@flanksource-ui/components/Permissions/SubjectSelectorPanel";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
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
    allowSelectiveAccess,
    isAllowingSelective,
    loading,
    isInitialLoading,
    preselectedSubjectIds,
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

    for (const playbook of playbooks) {
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
  }, [playbooks]);

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

        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-3 lg:max-w-3xl">
            <div className="space-y-4">
              {groupedPlaybooks.map((group) => {
                return (
                  <div key={group.category} className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">
                      {group.category}
                    </h4>

                    <div className="[&>*+*]:border-t [&>*+*]:border-gray-200 [&>*]:pb-2 [&>*]:pt-2">
                      {group.playbooks.map((playbook) => {
                        return (
                          <ResourceAccessCard
                            key={playbook.id}
                            entity={{
                              id: playbook.id,
                              name: playbook.title || playbook.name,
                              namespace: playbook.namespace,
                              icon: playbook.icon
                            }}
                            globalOverride={
                              globalOverrideByResource.get(playbook.id) ??
                              "none"
                            }
                            isMutating={mutatingResourceId === playbook.id}
                            isSelected={selectedPlaybook?.id === playbook.id}
                            onGlobalOverrideChange={(override) =>
                              setGlobalOverride(playbook, override)
                            }
                            onViewSubjects={() =>
                              setSelectedResourceId(playbook.id)
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-h-0 w-full shrink-0 lg:w-[420px]">
            {selectedPlaybook ? (
              <div className="relative h-full">
                <SubjectSelectorPanel
                  key={selectedPlaybook.id}
                  title={`Subject access for ${
                    selectedPlaybook.title || selectedPlaybook.name
                  }`}
                  description="Select users, teams, groups, or roles to allow this playbook for MCP usage."
                  preselectedSubjectIds={preselectedSubjectIds}
                  isSubmitting={isAllowingSelective}
                  onClose={() => setSelectedResourceId(null)}
                  onAllow={(subjects) =>
                    allowSelectiveAccess(selectedPlaybook, subjects)
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
