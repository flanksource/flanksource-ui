import { useFormikContext, FieldArray } from "formik";
import SelectDropdown from "@flanksource-ui/ui/Dropdowns/SelectDropdown";
import FormikResourceSelectorDropdown from "@flanksource-ui/components/Forms/Formik/FormikResourceSelectorDropdown";
import FormikViewSelectorDropdown from "@flanksource-ui/components/Forms/Formik/FormikViewSelectorDropdown";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import FormikCheckbox from "@flanksource-ui/components/Forms/Formik/FormikCheckbox";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useAllAgentNamesQuery } from "@flanksource-ui/api/query-hooks";
import { useMemo, useEffect } from "react";
import {
  ScopeTargetForm,
  scopeTargetLabels,
  wholeTypeScopeTargets
} from "@flanksource-ui/api/types/scopes";

type ScopeTargetsFormProps = {
  disabled?: boolean;
  submitCount?: number;
};

export default function ScopeTargetsForm({
  disabled = false,
  submitCount = 0
}: ScopeTargetsFormProps) {
  const { values, errors, touched } = useFormikContext<any>();
  const targets: ScopeTargetForm[] = values.targets || [];

  const { data: agents } = useAllAgentNamesQuery({});
  const agentOptions = useMemo(
    () =>
      (agents || []).map((agent: any) => ({
        label: agent.name,
        value: agent.name
      })),
    [agents]
  );

  return (
    <FieldArray name="targets">
      {({ push, remove }) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="form-label">Targets</label>
            {!disabled && (
              <Button
                className="btn-secondary btn-sm"
                onClick={() =>
                  push({
                    config: {
                      name: "",
                      agent: "",
                      tagSelector: "",
                      wildcard: false
                    }
                  })
                }
              >
                <FaPlus />
                Add Target
              </Button>
            )}
          </div>

          {targets.length === 0 && (
            <div className="rounded border-2 border-dashed py-6 text-center text-sm text-gray-500">
              No targets defined. Click &quot;Add Target&quot; to create one.
            </div>
          )}

          {/* Show validation error for targets */}
          {submitCount > 0 &&
            errors.targets &&
            typeof errors.targets === "string" && (
              <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
                {errors.targets}
              </div>
            )}

          {targets.map((target, index) => {
            // Get the error for this specific target
            // Only show error if:
            // 1. User has attempted to submit (submitCount > 0), AND
            // 2. This specific target has been touched/interacted with
            const targetTouched =
              touched.targets &&
              Array.isArray(touched.targets) &&
              touched.targets[index]
                ? Object.keys(touched.targets[index] || {}).length > 0
                : false;

            const targetError =
              submitCount > 0 &&
              targetTouched &&
              Array.isArray(errors.targets) &&
              errors.targets[index] &&
              typeof errors.targets[index] === "string"
                ? errors.targets[index]
                : undefined;

            return (
              <TargetBlock
                key={index}
                index={index}
                target={target}
                disabled={disabled}
                agentOptions={agentOptions}
                onRemove={() => {
                  if (targets.length > 1) {
                    remove(index);
                  }
                }}
                showRemove={targets.length > 1}
                error={targetError as string | undefined}
              />
            );
          })}
        </div>
      )}
    </FieldArray>
  );
}

type TargetBlockProps = {
  index: number;
  target: ScopeTargetForm;
  disabled: boolean;
  agentOptions: Array<{ label: string; value: string }>;
  onRemove: () => void;
  showRemove: boolean;
  error?: string;
};

function TargetBlock({
  index,
  target,
  disabled,
  agentOptions,
  onRemove,
  showRemove,
  error
}: TargetBlockProps) {
  const { setFieldValue, values } = useFormikContext<any>();

  const resourceKey = (Object.keys(target).find(
    (key) => target[key as keyof ScopeTargetForm]
  ) || "config") as keyof ScopeTargetForm;
  const resourceType = scopeTargetLabels[resourceKey];
  const isWholeType = wholeTypeScopeTargets.includes(resourceKey);

  // Keep the selector lossless: conflicting equalities select nothing, not the last value.
  const tagValues = new Map<string, string>();
  const hasConflictingTags = (
    values.targets?.[index]?.[resourceKey]?.tagSelector || ""
  )
    .split(",")
    .some((pair: string) => {
      const [key, value] = pair.split("=").map((part) => part.trim());
      if (value === undefined) return false;
      const conflicting = tagValues.has(key) && tagValues.get(key) !== value;
      tagValues.set(key, value);
      return conflicting;
    });

  // Get wildcard value from formik
  const isWildcard = values.targets?.[index]?.[resourceKey]?.wildcard || false;
  const additionalRestrictions = Object.entries(
    target[resourceKey] || {}
  ).filter(
    ([key, value]) =>
      ["id", "namespace", "types", "labelSelector"].includes(key) &&
      (Array.isArray(value) ? value.length > 0 : !!value)
  );

  // When wildcard is toggled, set name to "*" or clear it
  useEffect(() => {
    if (isWildcard) {
      setFieldValue(`targets.${index}.${resourceKey}.name`, "*");
    }
  }, [isWildcard, index, resourceKey, setFieldValue]);

  const handleResourceTypeChange = (newType: keyof ScopeTargetForm) => {
    setFieldValue(`targets.${index}`, {
      [newType]: wholeTypeScopeTargets.includes(newType)
        ? { name: "*", wildcard: true }
        : { name: "", wildcard: false }
    });
  };

  return (
    <div className="rounded border border-gray-300 bg-gray-50 p-3">
      {showRemove && !disabled && (
        <div className="mb-3 flex items-center justify-end">
          <Button
            icon={<FaTrash />}
            className="btn-danger-base btn-sm"
            onClick={onRemove}
            aria-label={`Remove target ${index + 1}`}
          />
        </div>
      )}

      <div className="space-y-3">
        {/* Resource Type Selector */}
        <div className={disabled ? "pointer-events-none opacity-60" : ""}>
          <div className="flex flex-col gap-2">
            <label className="form-label" htmlFor={`target-type-${index}`}>
              Resource Type
            </label>
            <SelectDropdown<keyof ScopeTargetForm>
              inputId={`target-type-${index}`}
              options={Object.entries(scopeTargetLabels).map(
                ([value, label]) => ({
                  value,
                  label
                })
              )}
              value={resourceKey}
              onChange={handleResourceTypeChange}
              isDisabled={disabled}
            />
          </div>
        </div>

        {/* Wildcard Toggle */}
        {isWholeType ? (
          <p className="text-sm text-gray-500">
            This resource type can only be selected entirely. All resources of
            this type will match.
          </p>
        ) : (
          <div className={disabled ? "pointer-events-none opacity-60" : ""}>
            <FormikCheckbox
              name={`targets.${index}.${resourceKey}.wildcard`}
              label="Match all (wildcard)"
              hint="When enabled, this target will match all resources of this type"
              hintPosition="tooltip"
              checkboxStyle="toggle"
              inline
              disabled={disabled}
            />
          </div>
        )}

        {additionalRestrictions.length > 0 && (
          <div
            role="status"
            className="rounded border border-orange-300 bg-orange-50 p-3 text-sm text-orange-900"
          >
            <p className="font-medium">Additional restrictions (read-only)</p>
            <dl className="my-2 space-y-1">
              {additionalRestrictions.map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <dt className="font-medium">{key}:</dt>
                  <dd className="break-all">
                    {Array.isArray(value) ? value.join(", ") : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
            <p>
              {isWildcard
                ? "Match all is enabled. These restrictions will be removed when you save."
                : "These restrictions are preserved on save. Enabling Match all removes them."}
            </p>
          </div>
        )}

        {/* Validation Error for this target */}
        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
            {error}
          </div>
        )}

        {/* Resource Name and Agent Selector - Horizontal layout */}
        {!isWholeType && (
          <div
            className={`flex gap-3 ${isWildcard ? "pointer-events-none opacity-50" : ""}`}
          >
            <div className="flex-1">
              {resourceType === "Config" && (
                <FormikResourceSelectorDropdown
                  name={`targets.${index}.config.name`}
                  label="Name"
                  configResourceSelector={[{}]}
                  hintLink={false}
                  className="flex flex-col space-y-2"
                  valueField="name"
                  disabled={isWildcard}
                />
              )}

              {resourceType === "Component" && (
                <FormikResourceSelectorDropdown
                  name={`targets.${index}.component.name`}
                  label="Name"
                  componentResourceSelector={[{}]}
                  hintLink={false}
                  className="flex flex-col space-y-2"
                  valueField="name"
                  disabled={isWildcard}
                />
              )}

              {resourceType === "Check" && (
                <FormikResourceSelectorDropdown
                  name={`targets.${index}.check.name`}
                  label="Name"
                  checkResourceSelector={[{}]}
                  hintLink={false}
                  className="flex flex-col space-y-2"
                  valueField="name"
                  disabled={isWildcard}
                />
              )}

              {resourceType === "Connection" && (
                <FormikResourceSelectorDropdown
                  name={`targets.${index}.connection.name`}
                  label="Name"
                  connectionResourceSelector={[{}]}
                  hintLink={false}
                  className="flex flex-col space-y-2"
                  valueField="name"
                  disabled={isWildcard}
                />
              )}

              {resourceType === "Scraper" && (
                <FormikTextInput
                  name={`targets.${index}.scraper.name`}
                  label="Name"
                  disabled={disabled || isWildcard}
                />
              )}

              {resourceType === "Playbook" && (
                <FormikResourceSelectorDropdown
                  name={`targets.${index}.playbook.name`}
                  label="Name"
                  playbookResourceSelector={[{}]}
                  hintLink={false}
                  className="flex flex-col space-y-2"
                  valueField="name"
                  disabled={isWildcard}
                />
              )}

              {resourceType === "Canary" && (
                <FormikResourceSelectorDropdown
                  name={`targets.${index}.canary.name`}
                  label="Name"
                  canaryResourceSelector={[{}]}
                  hintLink={false}
                  className="flex flex-col space-y-2"
                  valueField="name"
                  disabled={isWildcard}
                />
              )}

              {resourceType === "View" && (
                <FormikViewSelectorDropdown
                  name={`targets.${index}.view.name`}
                  label="View"
                  disabled={isWildcard}
                  className="flex flex-col space-y-2"
                />
              )}
            </div>

            {/* Connections, playbooks and views don't support agent selectors. */}
            {resourceType !== "Playbook" &&
              resourceType !== "View" &&
              resourceType !== "Connection" && (
                <div className="flex-1">
                  <FormikSelectDropdown
                    name={`targets.${index}.${resourceKey}.agent`}
                    label="Agent"
                    options={agentOptions}
                    hint="Select the agent for this resource"
                    isDisabled={disabled || isWildcard}
                  />
                </div>
              )}
          </div>
        )}

        {resourceType === "Config" && (
          <div
            className={
              disabled || isWildcard ? "pointer-events-none opacity-50" : ""
            }
          >
            <FormikTextInput
              name={`targets.${index}.${resourceKey}.tagSelector`}
              label="Tags"
              hint="Comma-separated key=value pairs. Resources must match ALL these tags."
              placeholder="env=prod,team=platform"
              disabled={disabled || isWildcard}
            />
            {hasConflictingTags && !isWildcard && (
              <p role="status" className="mt-2 text-sm text-orange-700">
                These tags require different values for the same key, so this
                target matches nothing. Use separate targets to match either
                value.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
