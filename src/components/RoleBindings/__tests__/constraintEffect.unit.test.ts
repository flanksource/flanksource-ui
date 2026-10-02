import { RoleRule } from "@flanksource-ui/api/types/roles";
import { ScopeTarget } from "@flanksource-ui/api/types/scopes";
import { getConstraintEffects } from "../constraintEffect";

// The Scopes and Role of rolebindings.md, Section 3.3
const scopes: Record<string, ScopeTarget[]> = {
  "production-configs": [{ config: { tagSelector: "env=production" } }],
  "monitoring-playbooks": [{ playbook: { name: "*" } }],
  "tenant-a": [
    { config: { tagSelector: "tenant=a" } },
    { playbook: { name: "*" } }
  ],
  "tenant-a-configs": [{ config: { tagSelector: "tenant=a" } }]
};

const readProduction: RoleRule = {
  name: "read-production",
  action: "read",
  resource: { scopeRef: "production-configs" }
};
const runMonitoring: RoleRule = {
  name: "run-monitoring",
  action: "playbook:run",
  resource: { scopeRef: "monitoring-playbooks" },
  target: { scopeRef: "production-configs" }
};

function effectsOf(
  rules: RoleRule[],
  constraint: { resource?: string; target?: string }
) {
  return getConstraintEffects(
    rules,
    { resource: constraint.resource ?? "", target: constraint.target ?? "" },
    scopes
  ).map(({ rule, resource, target, applies }) => ({
    rule: rule.name,
    resource: resource.kind,
    target: target.kind,
    applies
  }));
}

describe("getConstraintEffects", () => {
  it("narrows both sides, skipping the target of read", () => {
    expect(
      effectsOf([readProduction, runMonitoring], {
        resource: "tenant-a",
        target: "tenant-a"
      })
    ).toEqual([
      {
        rule: "read-production",
        resource: "narrowed",
        target: "skipped",
        applies: true
      },
      {
        rule: "run-monitoring",
        resource: "narrowed",
        target: "narrowed",
        applies: true
      }
    ]);
  });

  it("doesn't apply a rule that no side narrows", () => {
    expect(effectsOf([readProduction], { target: "tenant-a" })).toEqual([
      {
        rule: "read-production",
        resource: "unset",
        target: "skipped",
        applies: false
      }
    ]);
  });

  it("doesn't apply a rule whose scope shares no type with the constraint", () => {
    expect(
      effectsOf([runMonitoring], { resource: "tenant-a-configs" })[0]
    ).toMatchObject({ resource: "no-common-type", applies: false });
  });

  it("doesn't apply a targetless playbook:run rule under a target constraint", () => {
    const runWithoutTarget: RoleRule = {
      ...runMonitoring,
      target: undefined
    };
    expect(
      effectsOf([runWithoutTarget], {
        resource: "tenant-a",
        target: "tenant-a"
      })[0]
    ).toMatchObject({
      resource: "narrowed",
      target: "omitted",
      applies: false
    });
  });

  it("leaves deny rules out: they're never narrowed", () => {
    expect(
      effectsOf([{ ...readProduction, action: "delete", deny: true }], {
        resource: "tenant-a"
      })
    ).toEqual([]);
  });

  it("can't tell when a scope isn't known", () => {
    expect(
      effectsOf([readProduction], { resource: "missing" })[0].applies
    ).toBeUndefined();
  });
});
