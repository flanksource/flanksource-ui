import { RoleDisplay } from "@flanksource-ui/api/types/roles";
import { getActionContract, getScopeMismatch } from "../roleActions";
import {
  RoleFormValues,
  emptyRule,
  formValuesToSpec,
  roleToFormValues,
  validateRoleForm
} from "../roleFormValues";

function makeValues(overrides: Partial<RoleFormValues> = {}): RoleFormValues {
  return {
    name: "staging-operator",
    description: "",
    rules: [
      {
        ...emptyRule,
        name: "read-staging",
        action: "read",
        resource: "staging-configs"
      }
    ],
    ...overrides
  };
}

describe("formValuesToSpec", () => {
  it("builds plugin actions and drops fields the action doesn't take", () => {
    const spec = formValuesToSpec(
      makeValues({
        rules: [
          {
            ...emptyRule,
            name: "logs",
            action: "invoke",
            plugin: "kubernetes-logs",
            operation: "tail",
            resource: "pods",
            target: "leftover"
          },
          {
            ...emptyRule,
            name: "no-read-deny",
            action: "read",
            resource: "configs",
            deny: true
          },
          {
            ...emptyRule,
            name: "run",
            action: "playbook:run",
            resource: "playbooks",
            target: "configs",
            deny: true
          }
        ]
      })
    );

    expect(spec).toEqual({
      rules: [
        {
          name: "logs",
          action: "invoke:kubernetes-logs:tail",
          resource: { scopeRef: "pods" }
        },
        {
          name: "no-read-deny",
          action: "read",
          resource: { scopeRef: "configs" }
        },
        {
          name: "run",
          action: "playbook:run",
          resource: { scopeRef: "playbooks" },
          target: { scopeRef: "configs" },
          deny: true
        }
      ]
    });
  });

  it("round-trips a stored role", () => {
    const role = {
      name: "ops",
      namespace: "monitoring",
      description: "Operators",
      rules: [
        {
          name: "logs",
          action: "invoke:kubernetes-logs:tail",
          resource: { scopeRef: "pods" }
        },
        {
          name: "run",
          action: "playbook:run",
          resource: { scopeRef: "playbooks" },
          target: { scopeRef: "configs" }
        }
      ]
    } as RoleDisplay;

    const values = roleToFormValues(role);
    expect(values.namespace).toBe("monitoring");
    expect(values.rules[0]).toMatchObject({
      action: "invoke",
      plugin: "kubernetes-logs",
      operation: "tail"
    });
    expect(formValuesToSpec(values)).toEqual({
      description: "Operators",
      rules: role.rules
    });
  });
});

describe("validateRoleForm", () => {
  it("accepts a valid role", () => {
    expect(validateRoleForm(makeValues())).toEqual({});
  });

  it("rejects built-in role names", () => {
    expect(validateRoleForm(makeValues({ name: "viewer" })).name).toMatch(
      /built-in/
    );
  });

  it("rejects duplicate rule names, missing scopes and plugin patterns", () => {
    const errors = validateRoleForm(
      makeValues({
        rules: [
          { ...emptyRule, name: "a", action: "read", resource: "s" },
          {
            ...emptyRule,
            name: "a",
            action: "invoke",
            plugin: "kubernetes-logs",
            operation: "*"
          }
        ]
      })
    );

    expect(errors.rules).toEqual([
      undefined,
      {
        name: "Rule names must be unique",
        operation: expect.any(String),
        resource: "Scope is required"
      }
    ]);
  });
});

describe("getScopeMismatch", () => {
  it("warns when a scope selects types the action doesn't accept", () => {
    const run = getActionContract("playbook:run");
    expect(
      getScopeMismatch(run, "resource", [{ config: { name: "*" } }])
    ).toMatch(/selects config/);
    expect(
      getScopeMismatch(run, "resource", [{ playbook: { name: "*" } }])
    ).toBeUndefined();
    expect(getScopeMismatch(run, "target", [{ view: { name: "*" } }])).toMatch(
      /selects view/
    );
  });

  it("treats invoke actions as plugin operations on configs", () => {
    expect(getActionContract("invoke:kubernetes-logs:tail")?.resources).toEqual(
      ["config"]
    );
  });
});
