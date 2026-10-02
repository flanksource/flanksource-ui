import { RoleRule } from "@flanksource-ui/api/types/roles";
import FormikRoleScopeSelect from "@flanksource-ui/components/Roles/Forms/FormikRoleScopeSelect";
import { getActionContract } from "@flanksource-ui/components/Roles/roleActions";
import { useFormikContext } from "formik";
import { useEffect } from "react";
import {
  RoleBindingFormErrors,
  RoleBindingFormValues,
  syncConstraintsWithRole
} from "../roleBindingFormValues";

type RoleBindingConstraintsFormProps = {
  // Rules of the bound Role; undefined until a Role that exists is picked
  rules?: RoleRule[];
  namespace?: string;
};

export default function RoleBindingConstraintsForm({
  rules,
  namespace
}: RoleBindingConstraintsFormProps) {
  const { values, errors, submitCount, setFieldValue } =
    useFormikContext<RoleBindingFormValues>();

  // List every allow rule of the Role, keeping what's set
  useEffect(() => {
    if (!rules) {
      return;
    }
    const synced = syncConstraintsWithRole(values.constraints, rules);
    if (JSON.stringify(synced) !== JSON.stringify(values.constraints)) {
      setFieldValue("constraints", synced);
    }
  }, [rules, values.constraints, setFieldValue]);

  // A message for the list as a whole, set by validateRoleBindingForm
  const constraintsError = (errors as RoleBindingFormErrors).constraints;
  const denyRules = (rules ?? []).filter((rule) => rule.deny);

  return (
    <div className="flex flex-col gap-3 rounded-md border border-gray-200 p-4">
      <label className="form-label">Rules granted</label>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="radio"
          name="constraintMode"
          className="mt-1"
          checked={values.constraintMode === "all"}
          onChange={() => setFieldValue("constraintMode", "all")}
        />
        <span>
          <span className="font-medium">All rules of the role</span>
          <span className="block text-gray-500">
            Rules added to the role later are granted too.
          </span>
        </span>
      </label>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="radio"
          name="constraintMode"
          className="mt-1"
          checked={values.constraintMode === "selected"}
          onChange={() => setFieldValue("constraintMode", "selected")}
        />
        <span>
          <span className="font-medium">Only selected rules</span>
          <span className="block text-gray-500">
            Each can be narrowed to scopes in this binding&apos;s namespace.
            Rules added to the role later aren&apos;t granted until they&apos;re
            selected here.
          </span>
        </span>
      </label>

      {values.constraintMode === "selected" && (
        <div className="flex flex-col gap-3 pl-6">
          {!rules && values.constraints.length === 0 && (
            <p className="text-sm text-gray-500">
              Pick a role to choose its rules.
            </p>
          )}

          {values.constraints.map((constraint, index) => {
            const rule = rules?.find((item) => item.name === constraint.rule);
            const contract = getActionContract(rule?.action);
            const path = `constraints.${index}`;

            return (
              <div
                key={constraint.rule}
                className="flex flex-col gap-2 rounded-md border border-gray-200 p-3"
              >
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={constraint.include}
                    onChange={(event) =>
                      setFieldValue(`${path}.include`, event.target.checked)
                    }
                  />
                  <span className="font-medium">{constraint.rule}</span>
                  {rule && (
                    <span className="font-mono text-xs text-gray-500">
                      {rule.action} on {rule.resource.scopeRef}
                      {rule.target ? ` with ${rule.target.scopeRef}` : ""}
                    </span>
                  )}
                </label>

                {rules && !rule && (
                  <p className="text-xs text-yellow-700">
                    The role has no allow rule named {constraint.rule}; the
                    binding won&apos;t be in effect while it&apos;s selected.
                  </p>
                )}

                {constraint.include && (
                  <div className="flex flex-col gap-2 pl-6">
                    <FormikRoleScopeSelect
                      name={`${path}.resource`}
                      label="Narrow resource to scope"
                      hint="Optional. The resource must also be in this scope."
                      namespace={namespace}
                      contract={contract}
                      input="resource"
                    />
                    {/* A constraint can't add a target to a rule without one */}
                    {(rule?.target || constraint.target) && (
                      <FormikRoleScopeSelect
                        name={`${path}.target`}
                        label="Narrow target to scope"
                        hint="Optional. The target must also be in this scope."
                        namespace={namespace}
                        contract={contract}
                        input="target"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {submitCount > 0 && constraintsError && (
            <p className="text-sm text-red-500">{constraintsError}</p>
          )}
        </div>
      )}

      {denyRules.length > 0 && (
        <p className="text-xs text-gray-500">
          Deny rules always apply while the binding is in effect:{" "}
          {denyRules.map((rule) => rule.name).join(", ")}.
        </p>
      )}
    </div>
  );
}
