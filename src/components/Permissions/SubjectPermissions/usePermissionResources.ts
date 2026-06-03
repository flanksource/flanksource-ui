/**
 * Hook that loads playbooks, views, connections, and plugins, then normalizes
 * them into sorted permission matrix resources with supported actions.
 */
import {
  fetchPluginPermissionListings,
  type PluginOperationDefinition
} from "@flanksource-ui/api/services/permissions";
import { getAllPlaybookNames } from "@flanksource-ui/api/services/playbooks";
import { getAllViews } from "@flanksource-ui/api/services/views";
import { getAll } from "@flanksource-ui/api/schemaResources";
import { Connection } from "@flanksource-ui/components/Connections/ConnectionFormModal";
import { SchemaApi } from "@flanksource-ui/components/SchemaResourcePage/resourceTypes";
import {
  PermissionResource,
  RESOURCE_KIND_CONFIG,
  getPermissionActionForResource,
  sortPermissionResources
} from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const connectionsSchema: SchemaApi = {
  table: "connections",
  api: "canary-checker",
  name: "Connections"
};

function getPluginOperationName(operation: PluginOperationDefinition | string) {
  if (typeof operation === "string") {
    return operation.trim();
  }

  return operation.name?.trim() ?? "";
}

function getPluginOperationActions(
  pluginName: string,
  operations: Array<PluginOperationDefinition | string> = []
) {
  return Array.from(
    new Set(
      operations
        .map(getPluginOperationName)
        .filter(Boolean)
        .map((operationName) =>
          getPermissionActionForResource(
            { kind: "plugin", name: pluginName },
            operationName
          )
        )
    )
  );
}

export default function usePermissionResources() {
  const { data: playbooks = [], isLoading: isLoadingPlaybooks } = useQuery({
    queryKey: ["permissions-subjects", "playbooks"],
    queryFn: getAllPlaybookNames,
    staleTime: 60_000
  });

  const { data: viewsResponse, isLoading: isLoadingViews } = useQuery({
    queryKey: ["permissions-subjects", "views"],
    queryFn: async () => getAllViews([{ id: "name", desc: false }], 0, 2000),
    staleTime: 60_000
  });

  const { data: connections = [], isLoading: isLoadingConnections } = useQuery({
    queryKey: ["permissions-subjects", "connections"],
    queryFn: async () => {
      const response = await getAll(connectionsSchema);
      return (response.data ?? []) as unknown as Connection[];
    },
    staleTime: 60_000
  });

  const { data: plugins = [], isLoading: isLoadingPlugins } = useQuery({
    queryKey: ["permissions-subjects", "plugins"],
    queryFn: fetchPluginPermissionListings,
    staleTime: 60_000
  });

  const views = useMemo(() => viewsResponse?.data ?? [], [viewsResponse?.data]);

  const resources = useMemo<PermissionResource[]>(() => {
    const playbookResources = playbooks.map((playbook) => ({
      id: playbook.id,
      kind: "playbook" as const,
      name: playbook.name,
      displayName: playbook.title || playbook.name,
      namespace: playbook.namespace,
      icon: playbook.icon || "playbook",
      selectorKey: RESOURCE_KIND_CONFIG.playbook.selectorKey,
      actions: RESOURCE_KIND_CONFIG.playbook.actions
    }));

    const viewResources = views.map((view) => ({
      id: view.id,
      kind: "view" as const,
      name: view.name,
      displayName: view.spec?.title || view.name,
      namespace: view.namespace,
      icon: view.spec?.icon || "workflow",
      selectorKey: RESOURCE_KIND_CONFIG.view.selectorKey,
      actions: RESOURCE_KIND_CONFIG.view.actions
    }));

    const connectionResources = connections
      .filter(
        (connection): connection is Connection & { id: string; name: string } =>
          Boolean(connection.id && connection.name)
      )
      .map((connection) => ({
        id: connection.id,
        kind: "connection" as const,
        name: connection.name,
        displayName: connection.name,
        namespace: connection.namespace,
        icon: connection.type || "connection",
        selectorKey: RESOURCE_KIND_CONFIG.connection.selectorKey,
        actions: RESOURCE_KIND_CONFIG.connection.actions
      }));

    const pluginResources = plugins
      .map((plugin): PermissionResource | null => {
        const id = plugin.id ?? plugin.name;
        const name = plugin.name ?? plugin.id;

        if (!id || !name) {
          return null;
        }

        return {
          id,
          kind: "plugin" as const,
          name,
          displayName: name,
          icon: plugin.icon || "plugin",
          selectorKey: RESOURCE_KIND_CONFIG.plugin.selectorKey,
          actions: getPluginOperationActions(name, plugin.operations)
        };
      })
      .filter((resource): resource is PermissionResource => resource !== null);

    return sortPermissionResources([
      ...playbookResources,
      ...viewResources,
      ...connectionResources,
      ...pluginResources
    ]);
  }, [connections, playbooks, plugins, views]);

  return {
    resources,
    isLoading:
      isLoadingPlaybooks ||
      isLoadingViews ||
      isLoadingConnections ||
      isLoadingPlugins
  };
}
