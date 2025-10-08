import { useFormikContext, FieldArray } from "formik";
import FormikKeyValueMapField from "@flanksource-ui/components/Forms/Formik/FormikKeyValueMapField";
import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useAllAgentNamesQuery } from "@flanksource-ui/api/query-hooks";
import { useMemo } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

type AccessScopeCriteriaFormProps = {
  disabled?: boolean;
};

export default function AccessScopeCriteriaForm({
  disabled = false
}: AccessScopeCriteriaFormProps) {
  const { values } = useFormikContext<any>();
  const scopes = values.scopes || [];

  const { data: agents } = useAllAgentNamesQuery({});
  const agentOptions = useMemo(
    () =>
      (agents || []).map((agent: any) => ({
        label: agent.name || agent.id,
        value: agent.id
      })),
    [agents]
  );

  return (
    <FieldArray name="scopes">
      {({ push, remove }) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="form-label">Scopes</label>
            {!disabled && (
              <Button
                text="Add Scope"
                icon={<FaPlus />}
                className="btn-secondary btn-sm"
                onClick={() => push({ tags: {}, agents: [], names: "" })}
              />
            )}
          </div>

          {/* Info banner explaining AND/OR logic */}
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <p className="mb-1 font-medium">How scopes work:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Within a scope:</strong> Tags AND Agents AND Names (all
                must match)
              </li>
              <li>
                <strong>Between scopes:</strong> Scope 1 OR Scope 2 OR Scope 3
                (any can match)
              </li>
              <li>
                At least one scope is required, and each scope must have at
                least one field filled.
              </li>
            </ul>
          </div>

          {scopes.length === 0 && (
            <div className="rounded border-2 border-dashed py-6 text-center text-sm text-gray-500">
              No scopes defined. Click &quot;Add Scope&quot; to create one.
            </div>
          )}

          {scopes.map((scope: any, index: number) => (
            <div
              key={index}
              className="rounded border border-gray-300 bg-gray-50 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">
                  Scope {index + 1}
                </h4>
                {scopes.length > 1 && !disabled && (
                  <Button
                    icon={<FaTrash />}
                    className="btn-danger-base btn-sm"
                    onClick={() => remove(index)}
                    aria-label={`Remove scope ${index + 1}`}
                  />
                )}
              </div>

              <div className="space-y-2">
                <div
                  className={disabled ? "pointer-events-none opacity-60" : ""}
                >
                  <FormikKeyValueMapField
                    name={`scopes.${index}.tags`}
                    label="Tags"
                    hint="Resources must match ALL these tags"
                  />
                </div>

                <FormikSelectDropdown
                  name={`scopes.${index}.agents`}
                  label="Agents"
                  options={agentOptions}
                  isMulti
                  hint="Resources must be from ANY of these agents"
                  isDisabled={disabled}
                />

                <div
                  className={disabled ? "pointer-events-none opacity-60" : ""}
                >
                  <FormikTextArea
                    name={`scopes.${index}.names`}
                    label="Names"
                    placeholder="Enter resource names, one per line, or * for all"
                    hint="Exact resource name matches. Use * to match all names."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </FieldArray>
  );
}
