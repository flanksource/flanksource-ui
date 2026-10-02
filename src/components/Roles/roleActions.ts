import { ScopeTarget } from "@flanksource-ui/api/types/scopes";

// Mirrors the action contracts in mission-control (rbac/adapter/contracts.go): which resource types each
// action is performed on, which it takes as a target, and whether it can be denied.
// The server decides; these only drive the form and its warnings.
export type RoleActionContract = {
  value: string;
  label: string;
  description: string;
  resources: string[];
  targets: string[];
  allowsDeny: boolean;
};

// The value of the action dropdown for invoke:<plugin>:<operation>
export const PLUGIN_ACTION = "invoke";
export const PLUGIN_ACTION_PREFIX = "invoke:";

const genericResources = [
  "config",
  "component",
  "canary",
  "playbook",
  "connection"
];
const readableResources = [
  "config",
  "component",
  "check",
  "canary",
  "playbook",
  "connection"
];
const playbookTargets = ["config", "component", "check"];

export const roleActions: RoleActionContract[] = [
  {
    value: "read",
    label: "read",
    description: "Open and list resources",
    resources: readableResources,
    targets: [],
    allowsDeny: false
  },
  {
    value: "create",
    label: "create",
    description: "Create resources",
    resources: genericResources,
    targets: [],
    allowsDeny: true
  },
  {
    value: "update",
    label: "update",
    description: "Change resources",
    resources: genericResources,
    targets: [],
    allowsDeny: true
  },
  {
    value: "delete",
    label: "delete",
    description: "Delete resources",
    resources: genericResources,
    targets: [],
    allowsDeny: true
  },
  {
    value: "playbook:run",
    label: "playbook:run",
    description: "Run playbooks",
    resources: ["playbook"],
    targets: playbookTargets,
    allowsDeny: true
  },
  {
    value: "playbook:approve",
    label: "playbook:approve",
    description: "Approve playbook runs",
    resources: ["playbook"],
    targets: playbookTargets,
    allowsDeny: true
  },
  {
    value: "playbook:cancel",
    label: "playbook:cancel",
    description: "Cancel playbook runs",
    resources: ["playbook"],
    targets: playbookTargets,
    allowsDeny: true
  },
  {
    value: "mcp:run",
    label: "mcp:run",
    description: "Run playbooks through MCP",
    resources: ["playbook"],
    targets: [],
    allowsDeny: true
  },
  {
    value: PLUGIN_ACTION,
    label: "Plugin operation",
    description: "invoke:<plugin>:<operation> on configs",
    resources: ["config"],
    targets: [],
    allowsDeny: true
  }
];

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
  if (rejected.length === 0) {
    return undefined;
  }

  return `This scope selects ${rejected.join(", ")}, but ${contract.label} only accepts ${accepted.join(", ")} as its ${input}.`;
}
