import FormikCheckbox from "@flanksource-ui/components/Forms/Formik/FormikCheckbox";
import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import { ScopeDisplay } from "@flanksource-ui/api/types/scopes";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { FieldArray, useFormikContext } from "formik";
import { useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { PLUGIN_ACTION, getActionContract, roleActions } from "../roleActions";
import { RoleFormValues, emptyRule } from "../roleFormValues";
import FormikRoleScopeSelect from "./FormikRoleScopeSelect";

const actionOptions = roleActions.map((action) => ({
  value: action.value,
  label: (
    <div className="flex flex-row items-baseline gap-2">
      <span>{action.label}</span>
      <span className="text-xs text-gray-500">{action.description}</span>
    </div>
  )
}));

type RoleRuleFieldsProps = {
  index: number;
  namespace?: string;
  onScopeChange: (scope?: ScopeDisplay) => void;
  onRemove?: () => void;
};

function RoleRuleFields({
  index,
  namespace,
  onScopeChange,
  onRemove
}: RoleRuleFieldsProps) {
  const { values, setFieldValue } = useFormikContext<RoleFormValues>();
  const rule = values.rules[index];
  const contract = getActionContract(rule.action);
  const takesTarget = !!contract && contract.targets.length > 0;
  const canDeny = !contract || contract.allowsDeny;
  const path = `rules.${index}`;

  // Clear what the new action doesn't take, so it isn't sent and rejected
  useEffect(() => {
    if (!takesTarget && rule.target) {
      setFieldValue(`${path}.target`, "");
    }
    if (!canDeny && rule.deny) {
      setFieldValue(`${path}.deny`, false);
    }
  }, [takesTarget, canDeny, rule.target, rule.deny, path, setFieldValue]);

  return (
    <div className="flex flex-col gap-3 rounded-md border border-gray-200 p-4">
      <div className="flex flex-row items-start gap-3">
        <FormikTextInput
          name={`${path}.name`}
          label="Rule name"
          placeholder="e.g. read-staging"
          className="flex flex-1 flex-col"
        />
        {/* Labelled here rather than by FormikSelectDropdown, whose label has a
            bottom margin that the text input's label doesn't */}
        <div className="flex flex-1 flex-col">
          <label
            htmlFor={`${path}.action`}
            className="text-sm font-medium text-gray-700"
          >
            Action
          </label>
          <FormikSelectDropdown
            name={`${path}.action`}
            inputId={`${path}.action`}
            options={actionOptions}
            className="flex flex-col"
          />
        </div>
        {onRemove && (
          <button
            type="button"
            className="mt-7 p-1 text-gray-500 hover:text-red-600"
            title="Remove rule"
            onClick={onRemove}
          >
            <FaTrash />
          </button>
        )}
      </div>

      {rule.action === PLUGIN_ACTION && (
        <div className="flex flex-row gap-3">
          <FormikTextInput
            name={`${path}.plugin`}
            label="Plugin"
            placeholder="e.g. kubernetes-logs"
            className="flex flex-1 flex-col"
          />
          <FormikTextInput
            name={`${path}.operation`}
            label="Operation"
            placeholder="e.g. tail"
            className="flex flex-1 flex-col"
          />
        </div>
      )}

      <FormikRoleScopeSelect
        name={`${path}.resource`}
        label="Resource scope"
        hint={
          contract
            ? `The ${contract.resources.join(", ")} the action is performed on.`
            : "The resources the action is performed on."
        }
        namespace={namespace}
        contract={contract}
        input="resource"
        required
        onScopeChange={onScopeChange}
      />

      {takesTarget && (
        <FormikRoleScopeSelect
          name={`${path}.target`}
          label="Target scope"
          hint={`The ${contract!.targets.join(", ")} the playbook runs on. Without a target, the rule only covers runs without one.`}
          namespace={namespace}
          contract={contract}
          input="target"
          onScopeChange={onScopeChange}
        />
      )}

      <FormikTextInput
        name={`${path}.description`}
        label="Description"
        className="flex flex-col"
      />

      <div className="flex flex-col gap-1">
        <FormikCheckbox
          name={`${path}.deny`}
          label="Deny this action instead of allowing it"
          labelClassName="text-sm font-medium text-gray-700"
          disabled={!canDeny}
          inline
        />
        {/* Indented by the checkbox's width and gap, to line up with its label */}
        <p className="pl-6 text-xs text-gray-500">
          {canDeny
            ? "A deny overrides every allow, from any role or permission, for everyone but admins."
            : `${contract?.label} can't be denied yet.`}
        </p>
      </div>
    </div>
  );
}

type RoleRulesFormProps = {
  namespace?: string;
  onScopeChange: (scope?: ScopeDisplay) => void;
};

export default function RoleRulesForm({
  namespace,
  onScopeChange
}: RoleRulesFormProps) {
  const { values, errors } = useFormikContext<RoleFormValues>();

  return (
    <FieldArray name="rules">
      {({ push, remove }) => (
        <div className="flex flex-col gap-3">
          <label className="form-label">Rules</label>
          {values.rules.map((_, index) => (
            <RoleRuleFields
              key={index}
              index={index}
              namespace={namespace}
              onScopeChange={onScopeChange}
              onRemove={
                values.rules.length > 1 ? () => remove(index) : undefined
              }
            />
          ))}
          {typeof errors.rules === "string" && (
            <p className="text-sm text-red-500">{errors.rules}</p>
          )}
          <div>
            <Button
              text="Add rule"
              icon={<FaPlus />}
              className="btn-white"
              onClick={() => push({ ...emptyRule })}
            />
          </div>
        </div>
      )}
    </FieldArray>
  );
}
