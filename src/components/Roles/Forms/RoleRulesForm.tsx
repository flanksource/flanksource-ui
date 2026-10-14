import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import { ScopeDisplay } from "@flanksource-ui/api/types/scopes";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { FieldArray, useFormikContext } from "formik";
import { useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  PLUGIN_ACTION,
  RoleActionContract,
  getActionContract,
  roleActions,
  takesResource
} from "../roleActions";
import {
  LEGACY_DENY_MESSAGE,
  RoleFormValues,
  emptyRule
} from "../roleFormValues";
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
  const hasResource = takesResource(contract);
  const takesTarget = !!contract && contract.targets.length > 0;
  const path = `rules.${index}`;

  // Clear what the new action doesn't take, so it isn't sent and rejected
  useEffect(() => {
    if (!hasResource && rule.resource) {
      setFieldValue(`${path}.resource`, "");
    }
    if (!takesTarget && rule.target) {
      setFieldValue(`${path}.target`, "");
    }
  }, [hasResource, takesTarget, rule.resource, rule.target, path, setFieldValue]);

  return (
    <div
      className={`flex flex-col gap-3 rounded-md border p-4 ${rule.legacyDeny ? "border-red-300 bg-red-50" : "border-gray-200"}`}
    >
      {rule.legacyDeny && (
        <div className="flex flex-col gap-1 text-sm text-red-900">
          <p className="font-medium">
            <span className="mr-2 rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-800">
              deny
            </span>
            Unsupported deny rule
          </p>
          <p>{LEGACY_DENY_MESSAGE}</p>
        </div>
      )}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-start">
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
            className="self-end p-1 text-gray-500 hover:text-red-600 sm:mt-7 sm:self-auto"
            title="Remove rule"
            onClick={onRemove}
          >
            <FaTrash />
          </button>
        )}
      </div>

      {rule.action === PLUGIN_ACTION && (
        <div className="flex flex-col gap-3 sm:flex-row">
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

      {contract?.privilegeWarning && (
        <p
          role="alert"
          className="rounded-md border border-yellow-300 bg-yellow-50 p-2 text-xs text-yellow-900"
        >
          {contract.privilegeWarning}
        </p>
      )}

      {hasResource ? (
        <FormikRoleScopeSelect
          name={`${path}.resource`}
          label="Resource scope"
          hint={resourceHint(contract)}
          namespace={namespace}
          contract={contract}
          input="resource"
          required
          onScopeChange={onScopeChange}
        />
      ) : (
        <p className="text-xs text-gray-500">
          {contract!.label} isn&apos;t performed on a resource, so it takes no
          scope. A role binding with a constraint can&apos;t narrow it, so it
          doesn&apos;t apply through one.
        </p>
      )}

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

    </div>
  );
}

function resourceHint(contract?: RoleActionContract) {
  if (!contract) {
    return "The resources the action is performed on.";
  }
  const hint = `The ${contract.resources.join(", ")} the action is performed on.`;
  if (contract.value === "connection:use") {
    return `${hint} The scope may select any connections.`;
  }
  if (contract.wholeTypeOnly.length === contract.resources.length) {
    return `${hint} ${contract.label} is only checked on all resources of a type, so the scope must use whole-type targets (name: "*" and nothing else).`;
  }
  if (contract.wholeTypeOnly.length > 0) {
    return `${hint} Connections must be selected with a whole-type target (name: "*" and nothing else).`;
  }
  return hint;
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
