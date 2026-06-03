/**
 * Shared types, constants, and selector helpers used to build and evaluate the
 * subject permissions matrix.
 */
import {
  isSettingsManagedPermissionSource,
  PermissionSubject
} from "@flanksource-ui/api/services/permissions";
import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import { mapSubjectType } from "@flanksource-ui/lib/permissions/mcpPermissionCardMappings";

export type AccessValue = "allow" | "deny" | "default";
export type ResourceKind = "playbook" | "view" | "connection" | "plugin";
export type EffectiveState = "allowed" | "denied" | "unknown";
export type PermissionSelectorKey =
  | "playbooks"
  | "views"
  | "connections"
  | "configs";

type SelectorRef = {
  name?: string;
  namespace?: string;
};

export type PermissionResource = {
  id: string;
  kind: ResourceKind;
  name: string;
  displayName: string;
  namespace?: string;
  icon?: string;
  selectorKey: PermissionSelectorKey;
  actions: string[];
};

export type ResourceTypeGroup = {
  key: string;
  kind: ResourceKind;
  label: string;
  actions: string[];
  resources: PermissionResource[];
};

export type EffectiveAccessMap = Record<string, EffectiveState>;

export type DirectAccessState = {
  access: AccessValue;
  isReadOnly: boolean;
  source?: string;
  isWildcard: boolean;
};

export const RESOURCE_KIND_ORDER: ResourceKind[] = [
  "playbook",
  "view",
  "connection",
  "plugin"
];

export const RESOURCE_KIND_CONFIG: Record<
  ResourceKind,
  {
    label: string;
    actions: string[];
    selectorKey: PermissionSelectorKey;
  }
> = {
  playbook: {
    label: "Playbooks",
    actions: [
      "read",
      "playbook:run",
      "playbook:cancel",
      "playbook:approve",
      "mcp:run"
    ],
    selectorKey: "playbooks"
  },
  view: {
    label: "Views",
    actions: ["read", "mcp:run"],
    selectorKey: "views"
  },
  connection: {
    label: "Connections",
    actions: ["read"],
    selectorKey: "connections"
  },
  plugin: {
    label: "Plugins",
    actions: [],
    selectorKey: "configs"
  }
};

export const DEFAULT_DIRECT_STATE: DirectAccessState = {
  access: "default",
  isReadOnly: false,
  isWildcard: false
};

export function getResourceActionKey(
  resource: Pick<PermissionResource, "kind" | "id">,
  action: string
) {
  return `${resource.kind}:${resource.id}:${action}`;
}

export function getPluginWildcardPermissionAction(
  resource: Pick<PermissionResource, "kind" | "name">
) {
  return `invoke:${resource.name}:*`;
}

export function getPermissionActionForResource(
  resource: Pick<PermissionResource, "kind" | "name">,
  action: string
) {
  if (resource.kind !== "plugin") {
    return action;
  }

  if (action.startsWith("invoke:")) {
    return action;
  }

  if (action === "invoke") {
    return getPluginWildcardPermissionAction(resource);
  }

  return `invoke:${resource.name}:${action}`;
}

export function getDisplayActionForPermission(
  resource: Pick<PermissionResource, "kind" | "name">,
  action: string
) {
  if (resource.kind !== "plugin") {
    return action;
  }

  const prefix = `invoke:${resource.name}:`;

  if (action.startsWith(prefix)) {
    return action.slice(prefix.length);
  }

  return action;
}

export function getObjectSelectorForResource(resource: PermissionResource) {
  if (resource.kind === "plugin") {
    return {
      configs: [{ name: "*" }]
    };
  }

  return {
    [resource.selectorKey]: [
      { name: resource.name, namespace: resource.namespace }
    ]
  };
}

export function getRefsForPermission(
  permission: PermissionsSummary,
  selectorKey: PermissionSelectorKey
) {
  return permission.object_selector?.[selectorKey] ?? [];
}

export function selectorRefMatchesResource(
  ref: SelectorRef,
  resource: Pick<PermissionResource, "name" | "namespace">
) {
  if (!ref?.name) {
    return false;
  }

  if (ref.name === "*" && !ref.namespace) {
    return true;
  }

  if (ref.namespace) {
    return ref.namespace === resource.namespace && ref.name === resource.name;
  }

  return ref.name === resource.name;
}

export function selectorRefMatchesExactResource(
  ref: SelectorRef,
  resource: Pick<PermissionResource, "name" | "namespace">
) {
  if (!ref?.name || ref.name === "*") {
    return false;
  }

  if (ref.namespace) {
    return ref.namespace === resource.namespace && ref.name === resource.name;
  }

  return ref.name === resource.name;
}

function selectorRefIsWildcard(ref: SelectorRef) {
  return ref?.name === "*" && !ref?.namespace;
}

function getPermissionSourcePriority(permission: PermissionsSummary) {
  if (isSettingsManagedPermissionSource(permission.source)) {
    return 0;
  }

  return 1;
}

export function sortCanonicalPermissions(permissions: PermissionsSummary[]) {
  return [...permissions].sort((a, b) => {
    const sourceDiff =
      getPermissionSourcePriority(a) - getPermissionSourcePriority(b);

    if (sourceDiff !== 0) {
      return sourceDiff;
    }

    return (a.id ?? "").localeCompare(b.id ?? "");
  });
}

export function sortPermissionResources(resources: PermissionResource[]) {
  return [...resources].sort((a, b) => {
    const typeDiff =
      RESOURCE_KIND_ORDER.indexOf(a.kind) - RESOURCE_KIND_ORDER.indexOf(b.kind);

    if (typeDiff !== 0) {
      return typeDiff;
    }

    return a.displayName.localeCompare(b.displayName, undefined, {
      sensitivity: "base"
    });
  });
}

export function getDirectAccessState(
  permissions: PermissionsSummary[],
  subject: PermissionSubject,
  resource: PermissionResource,
  action: string
): DirectAccessState {
  const subjectType = mapSubjectType(subject.type);
  const permissionAction = getPermissionActionForResource(resource, action);
  const pluginWildcardAction =
    resource.kind === "plugin"
      ? getPluginWildcardPermissionAction(resource)
      : undefined;

  const matchingPermissions = permissions.filter((permission) => {
    const actionMatches =
      permission.action === permissionAction ||
      (pluginWildcardAction !== undefined &&
        permission.action === pluginWildcardAction);

    if (
      !actionMatches ||
      permission.subject !== subject.id ||
      permission.subject_type !== subjectType
    ) {
      return false;
    }

    return getRefsForPermission(permission, resource.selectorKey).some((ref) =>
      selectorRefMatchesResource(ref, resource)
    );
  });

  if (matchingPermissions.length === 0) {
    return DEFAULT_DIRECT_STATE;
  }

  const isReadOnly = matchingPermissions.some(
    (permission) => permission.source === "KubernetesCRD"
  );
  const isWildcard =
    resource.kind === "plugin"
      ? matchingPermissions.some(
          (permission) => permission.action === pluginWildcardAction
        )
      : matchingPermissions.some((permission) =>
          getRefsForPermission(permission, resource.selectorKey).some(
            selectorRefIsWildcard
          )
        );

  return {
    access: matchingPermissions.some((permission) => permission.deny === true)
      ? "deny"
      : "allow",
    isReadOnly,
    source: matchingPermissions[0]?.source,
    isWildcard
  };
}

export function groupResourcesByType(
  resources: PermissionResource[]
): ResourceTypeGroup[] {
  const grouped = new Map<ResourceKind, PermissionResource[]>();

  for (const resource of resources) {
    const list = grouped.get(resource.kind) ?? [];
    list.push(resource);
    grouped.set(resource.kind, list);
  }

  const groups: ResourceTypeGroup[] = [];

  for (const kind of RESOURCE_KIND_ORDER) {
    const resources = grouped.get(kind) ?? [];

    if (resources.length === 0) {
      continue;
    }

    if (kind === "plugin") {
      for (const resource of resources) {
        groups.push({
          key: `${kind}:${resource.id}`,
          kind,
          label: resource.displayName,
          actions: resource.actions,
          resources: [resource]
        });
      }
      continue;
    }

    const resourceActions = Array.from(
      new Set(resources.flatMap((resource) => resource.actions))
    );

    groups.push({
      key: kind,
      kind,
      label: RESOURCE_KIND_CONFIG[kind].label,
      actions:
        resourceActions.length > 0
          ? resourceActions
          : RESOURCE_KIND_CONFIG[kind].actions,
      resources
    });
  }

  return groups;
}

export function isSamePermissionResource(
  left: Pick<PermissionResource, "id" | "kind"> | null | undefined,
  right: Pick<PermissionResource, "id" | "kind"> | null | undefined
) {
  if (!left || !right) {
    return false;
  }

  return left.id === right.id && left.kind === right.kind;
}
