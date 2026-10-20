/**
 * Hook that loads the playbooks, views and connections the reviewer may read, then
 * normalizes them into sorted permission matrix resources with supported actions.
 */
import { getAllPlaybookNames } from "@flanksource-ui/api/services/playbooks";
import { getConnectionNames } from "@flanksource-ui/api/services/connections";
import { getViewsSummary } from "@flanksource-ui/api/services/views";
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

  const { data: views = [], isLoading: isLoadingViews } = useQuery({
    queryKey: ["permissions-subjects", "views"],
    queryFn: getViewsSummary,
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

    const viewResources = views.map((view) => ({
      id: view.id,
      kind: "view" as const,
      name: view.name,
      displayName: view.title || view.name,
      namespace: view.namespace,
      icon: view.icon || "workflow",
      actions: RESOURCE_KIND_CONFIG.view.actions
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
      ...viewResources,
      ...connectionResources
    ]);
  }, [connections, playbooks, views]);

  return {
    resources,
    isLoading: isLoadingPlaybooks || isLoadingViews || isLoadingConnections
  };
}
