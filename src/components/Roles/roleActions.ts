import { ScopeTarget } from "@flanksource-ui/api/types/scopes";

// Mirrors the action contracts of the Mission Control authorization spec (specs/authorization/roles.md,
// Section 2): which resource types each action is performed on, and which it takes as a target.
// The server decides; these only drive the form and its warnings.
export type RoleActionContract = {
  value: string;
  label: string;
  description: string;
  // Empty for the actions that take no resource, and so no Scope at all
  resources: string[];
  targets: string[];
  // Resource types the resource Scope may only select with whole-type targets (name: "*" alone)
  wholeTypeOnly: string[];
  // Why the action is only for subjects trusted as admins
  privilegeWarning?: string;
};

// The value of the action dropdown for invoke:<plugin>:<operation>
export const PLUGIN_ACTION = "invoke";
export const PLUGIN_ACTION_PREFIX = "invoke:";

const readableResources = [
  "config",
  "component",
  "check",
  "canary",
  "playbook",
  "connection",
  "application",
  "notification",
  "notificationSilence",
  "scraper",
  "agent",
  "person",
  "team",
  "scope",
  "role",
  "roleBinding"
];
// Checks are only written by Mission Control, and people only through person:manage
const writableResources = readableResources.filter(
  (type) => type !== "check" && type !== "person"
);
const playbookTargets = ["config", "component", "check"];

const adminPrivilege =
  "is as privileged as admin. Only grant it to subjects trusted as admins.";

function resourceless(
  value: string,
  description: string,
  privilegeWarning?: string
): RoleActionContract {
  return {
    value,
    label: value,
    description,
    resources: [],
    targets: [],
    wholeTypeOnly: [],
    privilegeWarning
  };
}

export const roleActions: RoleActionContract[] = [
  {
    value: "read",
    label: "read",
    description: "Open and list resources",
    resources: readableResources,
    targets: [],
    // Connections aren't filtered by row
    wholeTypeOnly: ["connection"]
  },
  ...(["create", "update", "delete"] as const).map((verb) => ({
    value: verb,
    label: verb,
    description: `${verb[0].toUpperCase()}${verb.slice(1)} resources`,
    resources: writableResources,
    targets: [],
    // Only checked on all resources of a type
    wholeTypeOnly: writableResources
  })),
  {
    value: "playbook:run",
    label: "playbook:run",
    description: "Run playbooks",
    resources: ["playbook"],
    targets: playbookTargets,
    wholeTypeOnly: []
  },
  {
    value: "playbook:approve",
    label: "playbook:approve",
    description: "Approve playbook runs",
    resources: ["playbook"],
    targets: playbookTargets,
    wholeTypeOnly: []
  },
  {
    value: "playbook:cancel",
    label: "playbook:cancel",
    description: "Cancel playbook runs",
    resources: ["playbook"],
    targets: playbookTargets,
    wholeTypeOnly: []
  },
  {
    value: "mcp:run",
    label: "mcp:run",
    description: "Run playbooks through MCP",
    resources: ["playbook"],
    targets: [],
    wholeTypeOnly: []
  },
  {
    value: "connection:use",
    label: "connection:use",
    description: "Act with or test a connection's credentials",
    resources: ["connection"],
    targets: [],
    wholeTypeOnly: []
  },
  {
    value: PLUGIN_ACTION,
    label: "Plugin operation",
    description: "invoke:<plugin>:<operation> on configs",
    resources: ["config"],
    targets: [],
    wholeTypeOnly: []
  },
  resourceless(
    "person:manage",
    "Invite, disable, change and delete accounts",
    `person:manage ${adminPrivilege} Inviting someone into teams grants what those teams are granted, and changing an email moves bindings between people.`
  ),
  resourceless("mcp:use", "Use the MCP server at all"),
  resourceless(
    "property:manage",
    "Create, change and delete properties and feature flags"
  ),
  resourceless("event:read", "Read the event queue and recent events"),
  resourceless(
    "job:read",
    "Read all job history",
    `job:read ${adminPrivilege} Job details and errors can mention resources the subject can't otherwise read.`
  ),
  resourceless(
    "kubernetes-proxy:read",
    "Use the Kubernetes proxy, read-only",
    "kubernetes-proxy:read sends requests as the Kubernetes user mission-control-reader, which can read Secrets in the namespaces the Helm chart grants it."
  ),
  resourceless(
    "kubernetes-proxy:write",
    "Use the Kubernetes proxy, with write access",
    "kubernetes-proxy:write sends requests as the Kubernetes user mission-control-writer, which can write Mission Control's resources, and Secrets in the namespaces the Helm chart grants it."
  )
];

export function takesResource(contract?: RoleActionContract): boolean {
  return !contract || contract.resources.length > 0;
}

export function getActionContract(
  action?: string
): RoleActionContract | undefined {
  if (!action) {
    return undefined;
  }
  const value = action.startsWith(PLUGIN_ACTION_PREFIX)
    ? PLUGIN_ACTION
    : action;
  return roleActions.find((item) => item.value === value);
}

// The resource types a Scope selects: the keys of its targets.
export function getScopeTypes(targets: ScopeTarget[] = []): string[] {
  const types = new Set<string>();
  targets.forEach((target) => {
    Object.entries(target).forEach(([type, selector]) => {
      if (selector) {
        types.add(type);
      }
    });
  });
  return Array.from(types);
}

/**
 * Returns why a Scope can't fill an input of the action, or undefined when it can.
 * A Role whose Scope doesn't fit is still stored, but isn't in effect.
 */
export function getScopeMismatch(
  contract: RoleActionContract | undefined,
  input: "resource" | "target",
  targets: ScopeTarget[] | undefined
): string | undefined {
  if (!contract || !targets) {
    return undefined;
  }

  const types = getScopeTypes(targets);
  if (types.includes("global")) {
    return "This scope has a global target, which only Permissions can use.";
  }

  const accepted = input === "resource" ? contract.resources : contract.targets;
  const rejected = types.filter((type) => !accepted.includes(type));
  if (rejected.length > 0) {
    return `This scope selects ${rejected.join(", ")}, but ${contract.label} only accepts ${accepted.join(", ")} as its ${input}.`;
  }

  if (input === "resource") {
    const partial = getPartialTypes(targets).filter((type) =>
      contract.wholeTypeOnly.includes(type)
    );
    if (partial.length > 0) {
      return `This scope selects only some ${partial.join(", ")}, but ${contract.label} on ${partial.join(", ")} needs whole-type targets (name: "*" and nothing else).`;
    }
  }

  return undefined;
}

// The types a Scope selects with a target that isn't a whole-type target: name "*" and nothing else.
function getPartialTypes(targets: ScopeTarget[]): string[] {
  const types = new Set<string>();
  targets.forEach((target) => {
    Object.entries(target).forEach(([type, selector]) => {
      if (!selector) {
        return;
      }
      const fields = Object.entries(selector).filter(
        ([, value]) => value !== undefined && value !== ""
      );
      if (
        fields.length !== 1 ||
        fields[0][0] !== "name" ||
        fields[0][1] !== "*"
      ) {
        types.add(type);
      }
    });
  });
  return Array.from(types);
}
