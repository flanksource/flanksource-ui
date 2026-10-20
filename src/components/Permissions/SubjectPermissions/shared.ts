/**
 * Shared types, constants, and helpers used to build the subject access matrix.
 */
import {
  SubjectAccessReviewAction,
  SubjectAccessReviewTarget
} from "@flanksource-ui/api/services/rbac";

export type ResourceKind = "playbook" | "view" | "connection";
// refused is an allowed action whose operation is refused anyway, e.g. a run on a target the subject can't read.
export type EffectiveState = "allowed" | "denied" | "unknown" | "refused";

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

// The tabs of the matrix: a resource type, or the actions that take no resource.
export type AccessTab = ResourceKind | "global";

export const RESOURCE_KIND_ORDER: ResourceKind[] = [
  "playbook",
  "view",
  "connection"
];

export const RESOURCE_KIND_CONFIG: Record<
  ResourceKind,
  {
    label: string;
    singular: string;
    actions: string[];
  }
> = {
  playbook: {
    label: "Playbooks",
    singular: "playbook",
    actions: [
      "read",
      "playbook:run",
      "playbook:approve",
      "playbook:cancel",
      "mcp:run"
    ]
  },
  view: {
    label: "Views",
    singular: "view",
    actions: ["read"]
  },
  connection: {
    label: "Connections",
    singular: "connection",
    actions: ["read", "connection:use"]
  }
};

// The actions a target can be picked for: they're checked on a playbook and, optionally, what it runs on.
export const TARGET_ACTIONS = [
  "playbook:run",
  "playbook:approve",
  "playbook:cancel"
];

export const ACTION_LABELS: Record<string, { label: string; hint?: string }> = {
  read: { label: "read" },
  "playbook:run": { label: "run" },
  "playbook:approve": { label: "approve" },
  "playbook:cancel": { label: "cancel" },
  "mcp:run": { label: "mcp:run", hint: "Running the playbook as an MCP tool" },
  "connection:use": {
    label: "use",
    hint: "Acting with the connection's credentials, e.g. sending a notification or testing it"
  }
};

// GLOBAL_ACTIONS are the actions that take no resource (specs/authorization/roles.md, Section 2.3).
export const GLOBAL_ACTIONS: Array<{
  action: SubjectAccessReviewAction;
  description: string;
}> = [
  {
    action: "person:manage",
    description:
      "Invite, disable, re-enable and delete accounts, and change their properties, name or email"
  },
  {
    action: "access:review",
    description: "Review what any subject may do, on this page"
  },
  {
    action: "mcp:use",
    description:
      "Use the MCP server at all. Each tool still checks what it touches"
  },
  {
    action: "property:manage",
    description:
      "Read private properties, and create, change and delete any property"
  },
  {
    action: "event:read",
    description:
      "Read the event queue, and the recent events playbooks and notifications handled"
  },
  {
    action: "job:read",
    description: "Read all job history"
  }
];

// A subject that isn't a person or a team can only be granted some actions.
export function actionsForSubject(
  subjectType: string,
  kind: ResourceKind,
  actions: string[]
) {
  switch (subjectType) {
    case "playbook":
      return actions.filter((action) =>
        ({
          playbook: ["read", "playbook:run"],
          view: ["read"],
          connection: ["read", "connection:use"]
        })[kind].includes(action)
      );
    case "plugin":
      // A plugin can only be granted read and connection:use on connections
      return kind === "connection" ? actions : [];
    default:
      return actions;
  }
}

export function tabsForSubject(subjectType: string): AccessTab[] {
  if (subjectType === "plugin") {
    return ["connection"];
  }
  return [...RESOURCE_KIND_ORDER, "global"];
}

export type AccessTarget = {
  type: keyof SubjectAccessReviewTarget;
  id: string;
  name: string;
  icon?: string;
};

export function targetResource(
  target: AccessTarget | undefined
): SubjectAccessReviewTarget | undefined {
  return target ? { [target.type]: target.id } : undefined;
}

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
