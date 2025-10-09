import { useFormikContext, FieldArray } from "formik";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import FormikResourceSelectorDropdown from "@flanksource-ui/components/Forms/Formik/FormikResourceSelectorDropdown";
import FormikKeyValueMapField from "@flanksource-ui/components/Forms/Formik/FormikKeyValueMapField";
import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import FormikCheckbox from "@flanksource-ui/components/Forms/Formik/FormikCheckbox";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useAllAgentNamesQuery } from "@flanksource-ui/api/query-hooks";
import { useMemo, useState, useEffect } from "react";
import { ScopeTarget } from "@flanksource-ui/api/types/scopes";

type ScopeTargetsFormProps = {
  disabled?: boolean;
  submitCount?: number;
};

export default function ScopeTargetsForm({
  disabled = false,
  submitCount = 0
}: ScopeTargetsFormProps) {
  const { values, errors, touched } = useFormikContext<any>();
  const targets: ScopeTarget[] = values.targets || [];

  const { data: agents } = useAllAgentNamesQuery({});
  const agentOptions = useMemo(
    () =>
      (agents || []).map((agent: any) => ({
        label: agent.name || agent.id,
        value: agent.name || agent.id
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
                text="Add Target"
                icon={<FaPlus />}
                className="btn-secondary btn-sm"
                onClick={() =>
                  push({
                    config: {
                      name: "",
                      agent: "",
                      tagSelector: "",
                      tags: {},
                      wildcard: false
                    }
                  })
                }
              />
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
  target: ScopeTarget;
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

  // Determine which resource type is selected
  const getInitialResourceType = ():
    | "Config"
    | "Component"
    | "Playbook"
    | "Canary"
    | "Global" => {
    if (target.config) return "Config";
    if (target.component) return "Component";
    if (target.playbook) return "Playbook";
    if (target.canary) return "Canary";
    if (target.global) return "Global";
    return "Config";
  };

  const [resourceType, setResourceType] = useState<
    "Config" | "Component" | "Playbook" | "Canary" | "Global"
  >(getInitialResourceType());

  const resourceKey = resourceType.toLowerCase() as
    | "config"
    | "component"
    | "playbook"
    | "canary"
    | "global";

  // Get wildcard value from formik
  const isWildcard = values.targets?.[index]?.[resourceKey]?.wildcard || false;

  // When wildcard is toggled, set name to "*" or clear it
  useEffect(() => {
    if (isWildcard) {
      setFieldValue(`targets.${index}.${resourceKey}.name`, "*");
    }
  }, [isWildcard, index, resourceKey, setFieldValue]);

  const handleResourceTypeChange = (
    newType: "Config" | "Component" | "Playbook" | "Canary" | "Global"
  ) => {
    setResourceType(newType);
    // Clear all resource type fields
    setFieldValue(`targets.${index}`, {
      [newType.toLowerCase()]: {
        name: "",
        agent: "",
        tagSelector: "",
        tags: {},
        wildcard: false
      }
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
            <label className="form-label">Resource Type</label>
            <Switch
              options={["Config", "Component", "Playbook", "Canary", "Global"]}
              className="w-auto"
              value={resourceType}
              onChange={handleResourceTypeChange}
            />
          </div>
        </div>

        {/* Wildcard Toggle */}
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

        {/* Validation Error for this target */}
        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
            {error}
          </div>
        )}

        {/* Global Warning */}
        {resourceType === "Global" && (
          <div className="rounded-md border border-orange-300 bg-orange-50 p-3 text-sm text-orange-900">
            <p className="font-medium">
              When targeting all resources globally, tags only apply to Config
              resources. Agent selection applies to all resources except
              Playbooks.
            </p>
          </div>
        )}

        {/* Resource Name and Agent Selector - Horizontal layout */}
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

            {resourceType === "Global" && (
              <FormikResourceSelectorDropdown
                name={`targets.${index}.global.name`}
                label="Name"
                configResourceSelector={[{}]}
                hintLink={false}
                className="flex flex-col space-y-2"
                valueField="name"
                disabled={isWildcard}
              />
            )}
          </div>

          {/* Agent Selector - Hide for Playbooks */}
          {resourceType !== "Playbook" && (
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

        {/* Tags Field - Only show for Config and Global */}
        {(resourceType === "Config" || resourceType === "Global") && (
          <div
            className={
              disabled || isWildcard ? "pointer-events-none opacity-50" : ""
            }
          >
            <FormikKeyValueMapField
              name={`targets.${index}.${resourceKey}.tags`}
              label="Tags"
              hint="Resources must match ALL these tags"
            />
          </div>
        )}
      </div>
    </div>
  );
}
