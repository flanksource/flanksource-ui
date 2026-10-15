/**
 * Hook that loads the playbooks and connections the reviewer may read, then
 * normalizes them into sorted permission matrix resources with supported actions.
 */
import { getAllPlaybookNames } from "@flanksource-ui/api/services/playbooks";
import { getConnectionNames } from "@flanksource-ui/api/services/connections";
import {
  PermissionResource,
  RESOURCE_KIND_CONFIG,
  sortPermissionResources
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function usePermissionResources() {
  const { data: playbooks = [], isLoading: isLoadingPlaybooks } = useQuery({
    queryKey: ["permissions-subjects", "playbooks"],
    queryFn: getAllPlaybookNames,
    staleTime: 60_000
  });

  const { data: connections = [], isLoading: isLoadingConnections } = useQuery({
    queryKey: ["permissions-subjects", "connections"],
    queryFn: getConnectionNames,
    staleTime: 60_000
  });

  const resources = useMemo<PermissionResource[]>(() => {
    const playbookResources = playbooks.map((playbook) => ({
      id: playbook.id,
      kind: "playbook" as const,
      name: playbook.name,
      displayName: playbook.title || playbook.name,
      namespace: playbook.namespace,
      icon: playbook.icon || "playbook",
      actions: RESOURCE_KIND_CONFIG.playbook.actions
    }));

    const connectionResources = connections
      .filter((connection) => Boolean(connection.id && connection.name))
      .map((connection) => ({
        id: connection.id!,
        kind: "connection" as const,
        name: connection.name!,
        displayName: connection.name!,
        namespace: connection.namespace,
        icon: connection.type || "connection",
        actions: RESOURCE_KIND_CONFIG.connection.actions
      }));

    return sortPermissionResources([
      ...playbookResources,
      ...connectionResources
    ]);
  }, [connections, playbooks]);

  return {
    resources,
    isLoading: isLoadingPlaybooks || isLoadingConnections
  };
}
