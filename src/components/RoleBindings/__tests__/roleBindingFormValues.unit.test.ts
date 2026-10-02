import { RoleBindingDisplay } from "@flanksource-ui/api/types/roleBindings";
import {
  RoleBindingFormValues,
  formValuesToSpec,
  roleBindingToFormValues,
  syncConstraintsWithRole,
  validateRoleBindingForm
} from "../roleBindingFormValues";

function makeValues(
  overrides: Partial<RoleBindingFormValues> = {}
): RoleBindingFormValues {
  return {
    ...roleBindingToFormValues(),
    name: "staging-operators",
    namespace: "default",
    role: "staging-operator",
    teams: ["platform"],
    ...overrides
  };
}

describe("formValuesToSpec", () => {
  it("sends only the subjects that are set, and no constraints for all rules", () => {
    expect(formValuesToSpec(makeValues())).toEqual({
      role: "staging-operator",
      subjects: { teams: ["platform"] }
    });
  });

  it("sends the selected rules with their scopes", () => {
    const spec = formValuesToSpec(
      makeValues({
        constraintMode: "selected",
        constraints: [
          { rule: "read", include: true, resource: "tenant-a", target: "" },
          { rule: "run", include: true, resource: "", target: "tenant-a" },
          { rule: "delete", include: false, resource: "x", target: "" }
        ]
      })
    );

    expect(spec.constraints).toEqual([
      { rule: "read", resource: { scopeRef: "tenant-a" } },
      { rule: "run", target: { scopeRef: "tenant-a" } }
    ]);
  });

  it("round-trips a stored binding", () => {
    const binding = {
      name: "tenant-a",
      namespace: "default",
      role: "operator",
      description: "Tenant A",
      subjects: {
        people: ["alice@example.com"],
        roles: ["guest"],
        oidc: [{ provider: "oipa", match: "claims.tenant == 'a'" }],
        playbooks: [{ namespace: "default", name: "cleanup" }],
        scrapers: [{ name: "*" }]
      },
      constraints: [{ rule: "read", resource: { scopeRef: "tenant-a" } }]
    } as RoleBindingDisplay;

    const values = roleBindingToFormValues(binding);
    expect(values.constraintMode).toBe("selected");
    expect(formValuesToSpec(values)).toEqual({
      description: "Tenant A",
      role: "operator",
      subjects: binding.subjects,
      constraints: binding.constraints
    });
  });
});

describe("syncConstraintsWithRole", () => {
  it("lists allow rules, keeps what's set, and keeps rules the role lost", () => {
    const synced = syncConstraintsWithRole(
      [
        { rule: "read", include: true, resource: "a", target: "" },
        { rule: "removed", include: true, resource: "", target: "" }
      ],
      [
        { name: "read", action: "read", resource: { scopeRef: "s" } },
        { name: "run", action: "playbook:run", resource: { scopeRef: "p" } },
        {
          name: "no-delete",
          action: "delete",
          resource: { scopeRef: "s" },
          deny: true
        }
      ]
    );

    expect(synced.map((constraint) => constraint.rule)).toEqual([
      "read",
      "run",
      "removed"
    ]);
    expect(synced[0].resource).toBe("a");
    expect(synced[1].include).toBe(false);
  });
});

describe("validateRoleBindingForm", () => {
  it("accepts a valid binding", () => {
    expect(validateRoleBindingForm(makeValues())).toEqual({});
  });

  it("requires a subject and a role", () => {
    const errors = validateRoleBindingForm(makeValues({ teams: [], role: "" }));
    expect(errors.subjects).toBe("At least one subject is required");
    expect(errors.role).toBe("Role is required");
  });

  it("rejects people that aren't emails and resource subjects with patterns", () => {
    const values = makeValues({ people: ["Alice"] });
    values.resourceSubjects.playbooks = [
      { namespace: "*", name: "" },
      { namespace: "", name: "clean-*" },
      { namespace: "", name: "*" }
    ];

    const errors = validateRoleBindingForm(values);
    expect(errors.people).toMatch(/Alice/);
    expect(errors.resourceSubjects?.playbooks).toEqual([
      { namespace: expect.any(String) },
      { name: expect.any(String) },
      undefined
    ]);
  });

  it("refuses selected rules with none selected, which would grant every rule", () => {
    const errors = validateRoleBindingForm(
      makeValues({
        constraintMode: "selected",
        constraints: [
          { rule: "read", include: false, resource: "", target: "" }
        ]
      })
    );
    expect(errors.constraints).toBe("Select at least one rule to grant");
  });
});
