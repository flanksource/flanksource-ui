/**
 * Shared types, constants, and helpers used to build the subject access matrix.
 */

export type ResourceKind = "playbook" | "connection";
export type EffectiveState = "allowed" | "denied" | "unknown";

export type PermissionResource = {
  id: string;
  kind: ResourceKind;
  name: string;
  displayName: string;
  namespace?: string;
  icon?: string;
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

export const RESOURCE_KIND_ORDER: ResourceKind[] = ["playbook", "connection"];

export const RESOURCE_KIND_CONFIG: Record<
  ResourceKind,
  {
    label: string;
    actions: string[];
  }
> = {
  playbook: {
    label: "Playbooks",
    actions: [
      "read",
      "playbook:run",
      "playbook:approve",
      "playbook:cancel",
      "mcp:run"
    ]
  },
  connection: {
    label: "Connections",
    actions: ["read"]
  }
};

// A review names no target, so it only matches rules without one: a rule limited to a target Scope shows as denied.
export const ACTION_LABELS: Record<string, { label: string; hint?: string }> = {
  read: { label: "read" },
  "playbook:run": {
    label: "run",
    hint: "Running without a target. Rules limited to target configs, components or checks aren't counted."
  },
  "playbook:approve": {
    label: "approve",
    hint: "Approving runs without a target. Rules limited to target configs, components or checks aren't counted."
  },
  "playbook:cancel": {
    label: "cancel",
    hint: "Cancelling runs without a target. Rules limited to target configs, components or checks aren't counted."
  },
  "mcp:run": { label: "mcp:run" }
};

export function getResourceActionKey(
  resource: Pick<PermissionResource, "kind" | "id">,
  action: string
) {
  return `${resource.kind}:${resource.id}:${action}`;
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
