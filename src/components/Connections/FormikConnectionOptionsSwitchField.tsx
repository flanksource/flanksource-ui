import { useFormikContext } from "formik";
import { get } from "lodash";
import { useState } from "react";
import { Switch } from "../../ui/FormControls/Switch";
import RenderConnectionFormFields from "./RenderConnectionFormFields";
import { ConnectionFormFields } from "./connectionTypes";

type Props = {
  field: ConnectionFormFields;
  disabled?: boolean;
};

export default function FormikConnectionOptionsSwitchField({
  field,
  disabled = false
}: Props) {
  const { setFieldValue, values } = useFormikContext<Record<string, any>>();

  const [selectedGroup, setSelectedGroup] = useState(() => {
    // find the first field that has a value
    const firstField = field.options?.find((option) => {
      return option.fields?.find((field) => get(values, field.key));
    });
    return firstField?.key ?? "None";
  });

  if (!field.options) {
    return null;
  }

  const selectedField = field.options.find(
    (option) => option.key === selectedGroup
  );

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <label className="text-sm font-semibold">{field.label}</label>
      <div className={disabled ? "pointer-events-none opacity-60" : ""}>
        <Switch
          options={["None", ...field.options?.map((option) => option.label)]}
          defaultValue="None"
          value={
            field.options?.find((option) => option.key === selectedGroup)?.label
          }
          onChange={(v) => {
            if (disabled) return;
            // reset all other fields that are not selected
            field.options?.forEach((option) => {
              if (option.key === v) {
                return;
              }
              setFieldValue(option.key, undefined);
            });
            setSelectedGroup(
              field.options?.find((option) => option.label === v)?.key ?? "None"
            );
          }}
        />
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto px-2">
        {selectedField?.fields?.map((field) => (
          <RenderConnectionFormFields
            field={field}
            key={field.key}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
