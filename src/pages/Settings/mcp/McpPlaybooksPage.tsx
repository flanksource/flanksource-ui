import { getAllPlaybookNames } from "@flanksource-ui/api/services/playbooks";
import { fetchMcpRunPermissions } from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import { useMcpResourcePermissions } from "@flanksource-ui/lib/permissions/useMcpResourcePermissions";
import PermissionAccessCard from "@flanksource-ui/components/Permissions/PermissionAccessCard";
import SubjectSelectorPanel from "@flanksource-ui/components/Permissions/SubjectSelectorPanel";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";
import { useQuery } from "@tanstack/react-query";

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
    permissionsByResource,
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
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto lg:max-w-3xl [&>*+*]:border-t [&>*+*]:border-gray-200 [&>*+*]:pt-2 [&>*]:pb-2">
            {playbooks.map((playbook) => {
              return (
                <PermissionAccessCard
                  key={playbook.id}
                  entity={{
                    id: playbook.id,
                    name: playbook.title || playbook.name,
                    namespace: playbook.namespace,
                    icon: playbook.icon
                  }}
                  globalOverride={
                    globalOverrideByResource.get(playbook.id) ?? "none"
                  }
                  isMutating={mutatingResourceId === playbook.id}
                  onGlobalOverrideChange={(override) =>
                    setGlobalOverride(playbook, override)
                  }
                  onViewSubjects={() => setSelectedResourceId(playbook.id)}
                />
              );
            })}
          </div>

          <div className="min-h-0 w-full shrink-0 lg:w-[420px]">
            {selectedPlaybook ? (
              <SubjectSelectorPanel
                key={selectedPlaybook.id}
                description="Select users, teams, groups, or roles to allow this playbook for MCP usage."
                preselectedSubjectIds={preselectedSubjectIds}
                isSubmitting={isAllowingSelective}
                onClose={() => setSelectedResourceId(null)}
                onAllow={(subjects) =>
                  allowSelectiveAccess(selectedPlaybook, subjects)
                }
              />
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
