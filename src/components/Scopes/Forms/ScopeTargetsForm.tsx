import { useFormikContext, FieldArray } from "formik";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import FormikResourceSelectorDropdown from "@flanksource-ui/components/Forms/Formik/FormikResourceSelectorDropdown";
import FormikKeyValueMapField from "@flanksource-ui/components/Forms/Formik/FormikKeyValueMapField";
import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useAllAgentNamesQuery } from "@flanksource-ui/api/query-hooks";
import { useMemo, useState } from "react";
import { ScopeTarget } from "@flanksource-ui/api/types/scopes";

type ScopeTargetsFormProps = {
  disabled?: boolean;
};

export default function ScopeTargetsForm({
  disabled = false
}: ScopeTargetsFormProps) {
  const { values } = useFormikContext<any>();
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
                    config: { name: "", agent: "", tagSelector: "", tags: {} }
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

          {targets.map((target, index) => (
            <TargetBlock
              key={index}
              index={index}
              target={target}
              disabled={disabled}
              agentOptions={agentOptions}
              onRemove={() => remove(index)}
              showRemove={targets.length > 1}
            />
          ))}
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
};

function TargetBlock({
  index,
  target,
  disabled,
  agentOptions,
  onRemove,
  showRemove
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
        tags: {}
      }
    });
  };

  const resourceKey = resourceType.toLowerCase() as
    | "config"
    | "component"
    | "playbook"
    | "canary"
    | "global";

  return (
    <div className="rounded border border-gray-300 bg-gray-50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Target {index + 1}
        </span>
        {showRemove && !disabled && (
          <Button
            icon={<FaTrash />}
            className="btn-danger-base btn-sm"
            onClick={onRemove}
            aria-label={`Remove target ${index + 1}`}
          />
        )}
      </div>

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

        {/* Resource Name Selector */}
        {resourceType === "Config" && (
          <FormikResourceSelectorDropdown
            name={`targets.${index}.config.name`}
            label="Name"
            configResourceSelector={[{}]}
            hintLink={false}
          />
        )}

        {resourceType === "Component" && (
          <FormikResourceSelectorDropdown
            name={`targets.${index}.component.name`}
            label="Name"
            componentResourceSelector={[{}]}
            hintLink={false}
          />
        )}

        {resourceType === "Playbook" && (
          <FormikResourceSelectorDropdown
            name={`targets.${index}.playbook.name`}
            label="Name"
            playbookResourceSelector={[{}]}
            hintLink={false}
          />
        )}

        {resourceType === "Canary" && (
          <FormikResourceSelectorDropdown
            name={`targets.${index}.canary.name`}
            label="Name"
            checkResourceSelector={[{}]}
            hintLink={false}
          />
        )}

        {resourceType === "Global" && (
          <FormikResourceSelectorDropdown
            name={`targets.${index}.global.name`}
            label="Name"
            configResourceSelector={[{}]}
            hintLink={false}
          />
        )}

        {/* Tags Field */}
        <div className={disabled ? "pointer-events-none opacity-60" : ""}>
          <FormikKeyValueMapField
            name={`targets.${index}.${resourceKey}.tags`}
            label="Tags"
            hint="Resources must match ALL these tags"
          />
        </div>

        {/* Agent Selector */}
        <FormikSelectDropdown
          name={`targets.${index}.${resourceKey}.agent`}
          label="Agent"
          options={agentOptions}
          hint="Select the agent for this resource"
          isDisabled={disabled}
        />
      </div>
    </div>
  );
}
