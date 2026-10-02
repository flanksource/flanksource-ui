import {
  RoleDisplay,
  RoleRule,
  RoleSpec
} from "@flanksource-ui/api/types/roles";
import {
  PLUGIN_ACTION,
  PLUGIN_ACTION_PREFIX,
  getActionContract
} from "./roleActions";

export type RoleRuleFormValues = {
  name: string;
  description: string;
  // An action from roleActions; PLUGIN_ACTION for invoke:<plugin>:<operation>
  action: string;
  plugin: string;
  operation: string;
  resource: string;
  target: string;
  deny: boolean;
};

export type RoleFormValues = {
  name: string;
  // Taken from the Scopes picked: a Role can only reference Scopes in its own namespace
  namespace?: string;
  description: string;
  rules: RoleRuleFormValues[];
};

// Names the built-in roles use; a Role can't take one.
export const RESERVED_ROLE_NAMES = [
  "admin",
  "everyone",
  "guest",
  "viewer",
  "editor",
  "commander",
  "responder",
  "agent"
];

const MAX_RULES = 50;
const dnsLabel = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
const dnsSubdomain =
  /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
const pluginPart = /^[^:*!, ]+$/;

export const emptyRule: RoleRuleFormValues = {
  name: "",
  description: "",
  action: "",
  plugin: "",
  operation: "",
  resource: "",
  target: "",
  deny: false
};

export function ruleToFormValues(rule: RoleRule): RoleRuleFormValues {
  const isPlugin = rule.action.startsWith(PLUGIN_ACTION_PREFIX);
  const [plugin = "", operation = ""] = isPlugin
    ? rule.action.slice(PLUGIN_ACTION_PREFIX.length).split(":")
    : [];

  return {
    name: rule.name,
    description: rule.description ?? "",
    action: isPlugin ? PLUGIN_ACTION : rule.action,
    plugin,
    operation,
    resource: rule.resource?.scopeRef ?? "",
    target: rule.target?.scopeRef ?? "",
    deny: rule.deny ?? false
  };
}

export function roleToFormValues(role?: RoleDisplay): RoleFormValues {
  if (!role) {
    return { name: "", description: "", rules: [{ ...emptyRule }] };
  }

  return {
    name: role.name,
    namespace: role.namespace ?? undefined,
    description: role.description ?? "",
    rules: (role.rules ?? []).map(ruleToFormValues)
  };
}

export function formValuesToRule(values: RoleRuleFormValues): RoleRule {
  const contract = getActionContract(values.action);
  const action =
    values.action === PLUGIN_ACTION
      ? `${PLUGIN_ACTION_PREFIX}${values.plugin.trim()}:${values.operation.trim()}`
      : values.action;

  return {
    name: values.name.trim(),
    ...(values.description.trim()
      ? { description: values.description.trim() }
      : {}),
    action,
    resource: { scopeRef: values.resource },
    // Fields the action doesn't take are dropped: the API rejects them
    ...(values.target && contract?.targets.length
      ? { target: { scopeRef: values.target } }
      : {}),
    ...(values.deny && contract?.allowsDeny ? { deny: true } : {})
  };
}

export function formValuesToSpec(values: RoleFormValues): RoleSpec {
  return {
    ...(values.description.trim()
      ? { description: values.description.trim() }
      : {}),
    rules: values.rules.map(formValuesToRule)
  };
}

type RuleErrors = Partial<Record<keyof RoleRuleFormValues, string>>;

export type RoleFormErrors = {
  name?: string;
  rules?: string | (RuleErrors | undefined)[];
};

// Checks what the API rejects on its own. What depends on the Scopes, e.g. a Scope selecting
// the wrong types, is stored by the API and reported as not in effect.
export function validateRoleForm(values: RoleFormValues): RoleFormErrors {
  const errors: RoleFormErrors = {};

  if (!values.name) {
    errors.name = "Name is required";
  } else if (values.name.length > 253 || !dnsSubdomain.test(values.name)) {
    errors.name =
      "Use lowercase letters, numbers, '-' and '.', starting and ending with a letter or number";
  } else if (RESERVED_ROLE_NAMES.includes(values.name)) {
    errors.name = `${values.name} is a built-in role`;
  }

  if (values.rules.length === 0) {
    errors.rules = "At least one rule is required";
    return errors;
  }
  if (values.rules.length > MAX_RULES) {
    errors.rules = `A role can have at most ${MAX_RULES} rules`;
    return errors;
  }

  const ruleErrors = values.rules.map((rule, index) => {
    const e: RuleErrors = {};

    if (!rule.name) {
      e.name = "Name is required";
    } else if (rule.name.length > 63 || !dnsLabel.test(rule.name)) {
      e.name =
        "Use lowercase letters, numbers and '-', starting and ending with a letter or number";
    } else if (
      values.rules.findIndex((other) => other.name === rule.name) !== index
    ) {
      e.name = "Rule names must be unique";
    }

    if (!rule.action) {
      e.action = "Action is required";
    } else if (rule.action === PLUGIN_ACTION) {
      if (!pluginPart.test(rule.plugin.trim())) {
        e.plugin = "Plugin is required, without ':', '*', '!', ',' or spaces";
      }
      if (!pluginPart.test(rule.operation.trim())) {
        e.operation =
          "Operation is required, without ':', '*', '!', ',' or spaces";
      }
    }

    if (!rule.resource) {
      e.resource = "Scope is required";
    }

    return Object.keys(e).length > 0 ? e : undefined;
  });

  if (ruleErrors.some(Boolean)) {
    errors.rules = ruleErrors;
  }

  return errors;
}

// Whether a rule references a Scope. A new Role takes the namespace of the Scopes it references.
export function hasScopeReference(values: RoleFormValues): boolean {
  return values.rules.some((rule) => rule.resource || rule.target);
}
