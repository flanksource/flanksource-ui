import { RoleRule } from "@flanksource-ui/api/types/roles";
import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import FormikRoleScopeSelect from "@flanksource-ui/components/Roles/Forms/FormikRoleScopeSelect";
import { getActionContract } from "@flanksource-ui/components/Roles/roleActions";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { FieldArray, useFormikContext } from "formik";
import { FaPlus, FaTrash } from "react-icons/fa";
import { RoleBindingFormValues } from "../roleBindingFormValues";

type RoleBindingConstraintsFormProps = {
  // Rules of the bound Role; undefined until a Role that exists is picked
  rules?: RoleRule[];
  namespace?: string;
};

// spec.constraints: each narrows one allow rule of the Role to Scopes in the binding's namespace
export default function RoleBindingConstraintsForm({
  rules,
  namespace
}: RoleBindingConstraintsFormProps) {
  const { values } = useFormikContext<RoleBindingFormValues>();

  const ruleOptions = (rules ?? [])
    .filter((rule) => !rule.deny)
    .map((rule) => ({
      value: rule.name,
      label: (
        <div className="flex flex-row items-baseline gap-2">
          <span>{rule.name}</span>
          <span className="font-mono text-xs text-gray-500">
            {rule.action} on {rule.resource.scopeRef}
            {rule.target ? ` with ${rule.target.scopeRef}` : ""}
          </span>
        </div>
      )
    }));

  return (
    <FieldArray name="constraints">
      {({ push, remove }) => (
        <div className="flex flex-col gap-3">
          <div>
            <label className="form-label">Constraints</label>
            <p className="text-xs text-gray-500">
              Without constraints, the binding grants every rule of the role as
              defined. With constraints, it grants only the allow rules they
              name, each narrowed to the scopes set. Deny rules always apply as
              written.
            </p>
          </div>

          {values.constraints.map((constraint, index) => {
            const path = `constraints.${index}`;
            const rule = rules?.find((item) => item.name === constraint.rule);
            const contract = getActionContract(rule?.action);
            // A saved constraint on a rule the role doesn't have is still listed
            const options =
              constraint.rule &&
              !ruleOptions.some((option) => option.value === constraint.rule)
                ? [
                    ...ruleOptions,
                    { value: constraint.rule, label: constraint.rule }
                  ]
                : ruleOptions;

            return (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-md border border-gray-200 p-4"
              >
                <div className="flex flex-row items-start gap-3">
                  <div className="flex flex-1 flex-col">
                    <label
                      htmlFor={`${path}.rule`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Rule <span className="text-red-500">*</span>
                    </label>
                    <FormikSelectDropdown
                      name={`${path}.rule`}
                      inputId={`${path}.rule`}
                      options={options}
                      placeholder={
                        rules ? "Select a rule..." : "Pick a role first"
                      }
                      className="flex flex-col"
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-7 p-1 text-gray-500 hover:text-red-600"
                    title="Remove constraint"
                    onClick={() => remove(index)}
                  >
                    <FaTrash />
                  </button>
                </div>

                {rules && constraint.rule && !rule && (
                  <p className="text-xs text-yellow-700">
                    The role has no rule named {constraint.rule}; the binding
                    won&apos;t be in effect until it does.
                  </p>
                )}
                {rule?.deny && (
                  <p className="text-xs text-yellow-700">
                    {rule.name} is a deny rule, which a constraint can&apos;t
                    name; the binding won&apos;t be in effect.
                  </p>
                )}

                <FormikRoleScopeSelect
                  name={`${path}.resource`}
                  label="Resource"
                  hint="Optional. A scope the rule's resource must also belong to."
                  namespace={namespace}
                  contract={contract}
                  input="resource"
                />

                {/* A constraint can't add a target to a rule without one */}
                {(rule?.target || constraint.target) && (
                  <FormikRoleScopeSelect
                    name={`${path}.target`}
                    label="Target"
                    hint="Optional. A scope the rule's target must also belong to."
                    namespace={namespace}
                    contract={contract}
                    input="target"
                  />
                )}
              </div>
            );
          })}

          <div>
            <Button
              text="Add constraint"
              icon={<FaPlus />}
              className="btn-white"
              onClick={() => push({ rule: "", resource: "", target: "" })}
            />
          </div>
        </div>
      )}
    </FieldArray>
  );
}
