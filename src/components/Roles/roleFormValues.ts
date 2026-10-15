import {
  RBAC_DEFAULT_NAMESPACE,
  absoluteRbacReference,
  relativeRbacReference,
  validateRbacNamespace
} from "@flanksource-ui/api/types/rbacResources";
import {
  RoleDisplay,
  RoleRule,
  RoleSpec
} from "@flanksource-ui/api/types/roles";
import {
  PLUGIN_ACTION,
  PLUGIN_ACTION_PREFIX,
  getActionContract,
  takesResource
} from "./roleActions";

export type RoleRuleFormValues = {
  name: string;
  description: string;
  // An action from roleActions; PLUGIN_ACTION for invoke:<plugin>:<operation>
  action: string;
  plugin: string;
  operation: string;
  // Scope references as namespace/name, so they keep naming the same Scopes if the namespace changes.
  // They're written as a bare name when the Scope is in the role's namespace.
  resource: string;
  target: string;
  // A deny rule stored before deny was rejected. It's never sent: the role can't be
  // saved until the rule is removed, since saving it as an allow would grant what it denied.
  legacyDeny: boolean;
};

export type RoleFormValues = {
  name: string;
  namespace: string;
  description: string;
  rules: RoleRuleFormValues[];
};

export const LEGACY_DENY_MESSAGE =
  "Deny rules aren't supported: rules only allow. Remove this rule to save the role. Saving it as an allow rule would grant what it denied.";

const MAX_RULES = 50;
const dnsLabel = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
const scopeReference =
  /^([a-z0-9]([-a-z0-9]*[a-z0-9])?\/)?[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
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
  legacyDeny: false
};

export function ruleToFormValues(
  rule: RoleRule,
  namespace: string
): RoleRuleFormValues {
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
    resource: rule.resource?.scopeRef
      ? absoluteRbacReference(namespace, rule.resource.scopeRef)
      : "",
    target: rule.target?.scopeRef
      ? absoluteRbacReference(namespace, rule.target.scopeRef)
      : "",
    legacyDeny: rule.deny === true
  };
}

export function roleToFormValues(role?: RoleDisplay): RoleFormValues {
  if (!role) {
    return {
      name: "",
      namespace: RBAC_DEFAULT_NAMESPACE,
      description: "",
      rules: [{ ...emptyRule }]
    };
  }

  const namespace = role.namespace || RBAC_DEFAULT_NAMESPACE;
  return {
    name: role.name,
    namespace,
    description: role.description ?? "",
    rules: (role.rules ?? []).map((rule) => ruleToFormValues(rule, namespace))
  };
}

export function formValuesToRule(
  values: RoleRuleFormValues,
  namespace: string
): RoleRule {
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
    // Fields the action doesn't take are dropped: the API rejects them. deny is never sent.
    ...(takesResource(contract)
      ? {
          resource: {
            scopeRef: relativeRbacReference(namespace, values.resource)
          }
        }
      : {}),
    ...(values.target && contract?.targets.length
      ? {
          target: { scopeRef: relativeRbacReference(namespace, values.target) }
        }
      : {})
  };
}

export function formValuesToSpec(values: RoleFormValues): RoleSpec {
  return {
    ...(values.description.trim()
      ? { description: values.description.trim() }
      : {}),
    rules: values.rules.map((rule) =>
      formValuesToRule(rule, values.namespace || RBAC_DEFAULT_NAMESPACE)
    )
  };
}

type RuleErrors = Partial<Record<keyof RoleRuleFormValues, string>>;

export type RoleFormErrors = {
  name?: string;
  namespace?: string;
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
  }

  const namespaceError = validateRbacNamespace(values.namespace);
  if (namespaceError) {
    errors.namespace = namespaceError;
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

    if (!rule.resource && takesResource(getActionContract(rule.action))) {
      e.resource = "Scope is required";
    } else if (rule.resource && !scopeReference.test(rule.resource)) {
      e.resource = "Use a Scope name, or namespace/name";
    }
    if (rule.target && !scopeReference.test(rule.target)) {
      e.target = "Use a Scope name, or namespace/name";
    }

    if (rule.legacyDeny) {
      e.legacyDeny = LEGACY_DENY_MESSAGE;
    }

    return Object.keys(e).length > 0 ? e : undefined;
  });

  if (ruleErrors.some(Boolean)) {
    errors.rules = ruleErrors;
  }

  return errors;
}
