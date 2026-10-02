import { RoleBindingDisplay } from "@flanksource-ui/api/types/roleBindings";
import {
  RoleBindingFormValues,
  formValuesToSpec,
  roleBindingToFormValues,
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

  it("sends constraints with only the scopes set", () => {
    const spec = formValuesToSpec(
      makeValues({
        constraints: [
          { rule: "read", resource: "tenant-a", target: "" },
          { rule: "run", resource: "", target: "tenant-a" },
          { rule: "cancel", resource: "", target: "" }
        ]
      })
    );

    expect(spec.constraints).toEqual([
      { rule: "read", resource: { scopeRef: "tenant-a" } },
      { rule: "run", target: { scopeRef: "tenant-a" } },
      { rule: "cancel" }
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
    expect(values.constraints).toHaveLength(1);
    expect(formValuesToSpec(values)).toEqual({
      description: "Tenant A",
      role: "operator",
      subjects: binding.subjects,
      constraints: binding.constraints
    });
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

  it("rejects a constraint without a rule, and a rule constrained twice", () => {
    const errors = validateRoleBindingForm(
      makeValues({
        constraints: [
          { rule: "read", resource: "", target: "" },
          { rule: "", resource: "", target: "" },
          { rule: "read", resource: "a", target: "" }
        ]
      })
    );
    expect(errors.constraints).toEqual([
      undefined,
      { rule: "Rule is required" },
      { rule: "read is already constrained" }
    ]);
  });
});
