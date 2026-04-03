import {
  PermissionGlobalObject,
  PermissionsSummary
} from "@flanksource-ui/api/types/permissions";
import CanaryLink from "../Canary/CanaryLink";
import ConfigLink from "../Configs/ConfigLink/ConfigLink";
import ConnectionIcon from "../Connections/ConnectionIcon";
import ConnectionLink from "../Connections/ConnectionLink";
import PlaybookSpecIcon from "../Playbooks/Settings/PlaybookSpecIcon";
import { TopologyLink } from "../Topology/TopologyLink";
import { PermissionErrorDisplay } from "./PermissionErrorDisplay";

interface ScopeObject {
  namespace?: string;
  name?: string;
}

const formatScopeText = (scope: ScopeObject): string => {
  const namespace = scope.namespace || "";
  const name = scope.name || "";
  return namespace && name ? `${namespace}/${name}` : name;
};

type SelectorResourceType =
  | "playbooks"
  | "connections"
  | "configs"
  | "components";

type ResourceSelector = {
  id?: string;
  name?: string;
  namespace?: string;
  type?: string;
  icon?: string;
};

type ResourceSelectorWithName = ResourceSelector & {
  name: string;
};

const getSingleResourceSelector = (
  objectSelector?: PermissionsSummary["object_selector"]
):
  | { resourceType: SelectorResourceType; selector: ResourceSelectorWithName }
  | undefined => {
  if (!objectSelector) {
    return undefined;
  }

  const selectorEntries = Object.entries(objectSelector).filter(
    ([, value]) => Array.isArray(value) && value.length > 0
  );

  if (selectorEntries.length !== 1) {
    return undefined;
  }

  const [resourceType, selectorItems] = selectorEntries[0] as [
    string,
    ResourceSelector[]
  ];

  if (
    !["playbooks", "connections", "configs", "components"].includes(
      resourceType
    ) ||
    selectorItems.length !== 1
  ) {
    return undefined;
  }

  const selector = selectorItems[0];

  if (!selector?.name) {
    return undefined;
  }

  return {
    resourceType: resourceType as SelectorResourceType,
    selector: {
      ...selector,
      name: selector.name
    }
  };
};

type PermissionResourceCellProps = {
  permission: PermissionsSummary;
};

const OBJECT_LABELS: Record<PermissionGlobalObject, string> = {
  catalog: "Catalog",
  component: "Component",
  canaries: "Canaries",
  connection: "Connection",
  playbook: "Playbook",
  topology: "Topology",
  mcp: "MCP"
};

export default function PermissionResourceCell({
  permission
}: PermissionResourceCellProps) {
  const config = permission.config_object;
  const playbook = permission.playbook_object;
  const component = permission.component_object;
  const connection = permission.connection_object;
  const canary = permission.canary_object;
  const object = permission.object;
  const objectSelector = permission.object_selector;
  const error = permission.error;
  const hasConcreteObject = Boolean(
    config || playbook || component || canary || connection
  );

  if (objectSelector) {
    // Format scopes as "Scope: namespace/name, namespace2/name2"
    if (objectSelector.scopes && Array.isArray(objectSelector.scopes)) {
      const scopes = objectSelector.scopes;
      const maxDisplay = 2;
      const displayScopes = scopes.slice(0, maxDisplay);
      const remaining = scopes.length - maxDisplay;

      const scopeText = displayScopes
        .map(formatScopeText)
        .filter(Boolean)
        .join(", ");

      const fullScopeText = scopes
        .map(formatScopeText)
        .filter(Boolean)
        .join(", ");

      return (
        <div className="flex flex-row items-center gap-3">
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm text-gray-600">Scope:</span>
            <span className="truncate font-mono text-sm" title={fullScopeText}>
              {scopeText}
              {remaining > 0 && ` and ${remaining} more...`}
            </span>
          </div>
          <PermissionErrorDisplay error={error} />
        </div>
      );
    }

    const selectedResource = getSingleResourceSelector(objectSelector);

    if (selectedResource) {
      const selectorLabel = selectedResource.selector.namespace
        ? `${selectedResource.selector.namespace}/${selectedResource.selector.name}`
        : selectedResource.selector.name;

      if (selectedResource.resourceType === "connections") {
        return (
          <div className="flex flex-row items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">Connection:</span>
              <ConnectionLink
                connectionId={selectedResource.selector.id}
                connectionName={selectedResource.selector.name}
                connectionNamespace={selectedResource.selector.namespace}
              />
            </div>
            <PermissionErrorDisplay error={error} />
          </div>
        );
      }

      return (
        <div className="flex flex-row items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600">
              {selectedResource.resourceType === "playbooks"
                ? "Playbook:"
                : selectedResource.resourceType === "configs"
                  ? "Catalog:"
                  : "Component:"}
            </span>
            <span>{selectorLabel}</span>
          </div>
          <PermissionErrorDisplay error={error} />
        </div>
      );
    }

    // Fallback to JSON for non-scope object selectors
    return (
      <div className="flex flex-row items-center gap-3">
        <div className="flex flex-row items-center gap-2">
          <span
            className="truncate font-mono text-sm"
            title={JSON.stringify(objectSelector)} // Provides full text on hover
          >
            {JSON.stringify(objectSelector)}
          </span>
        </div>
        <PermissionErrorDisplay error={error} />
      </div>
    );
  }

  if (hasConcreteObject) {
    return (
      <div className="flex flex-row items-center gap-3">
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col">
            {config && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Catalog:</span>
                <ConfigLink config={config} />
              </div>
            )}

            {playbook && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Playbook:</span>
                <PlaybookSpecIcon
                  playbook={{
                    ...playbook,
                    title: playbook.name,
                    spec: { icon: playbook.icon || "", actions: [] }
                  }}
                  showLabel
                />
              </div>
            )}

            {component && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Component:</span>
                <TopologyLink
                  topology={component}
                  className="h-5 w-5 text-gray-600"
                  linkClassName="text-gray-600"
                  size="md"
                />
              </div>
            )}

            {canary && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Canary:</span>
                <CanaryLink canary={canary} />
              </div>
            )}

            {connection && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Connection:</span>
                <ConnectionIcon connection={connection} showLabel />
              </div>
            )}
          </div>
        </div>
        <PermissionErrorDisplay error={error} />
      </div>
    );
  }

  if (object) {
    return (
      <div className="flex flex-row items-center gap-3">
        <div className="flex flex-row items-center gap-2">
          <span>{OBJECT_LABELS[object] ?? object}</span>
        </div>
        <PermissionErrorDisplay error={error} />
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-3">
      <PermissionErrorDisplay error={error} />
    </div>
  );
}
