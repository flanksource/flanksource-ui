import FormikCheckbox from "../Forms/Formik/FormikCheckbox";
import { FormikCompactEnvVarSource } from "../Forms/Formik/FormikCompactEnvVarSource";
import { FormikEnvVarSource } from "../Forms/Formik/FormikEnvVarSource";
import FormikSwitchField from "../Forms/Formik/FormikSwitchField";
import FormikTextInput from "../Forms/Formik/FormikTextInput";
import FormikConnectionOptionsSwitchField from "./FormikConnectionOptionsSwitchField";
import { ConnectionFormFields } from "./connectionTypes";

interface FieldViewProps {
  field: ConnectionFormFields;
  disabled?: boolean;
}

export default function RenderConnectionFormFields({
  field,
  disabled = false
}: FieldViewProps) {
  const type = field.type ?? "input";
  switch (type) {
    case "input":
      return (
        <FormikTextInput
          name={field.key}
          label={field.label}
          required={field.required}
          hint={field.hint}
          defaultValue={field.default?.toString()}
          disabled={disabled}
        />
      );
    case "numberInput":
      return (
        <FormikTextInput
          type="number"
          name={field.key}
          label={field.label}
          required={field.required}
          hint={field.hint}
          defaultValue={field.default?.toString()}
          disabled={disabled}
        />
      );
    case "checkbox":
      return (
        <FormikCheckbox
          name={field.key}
          label={field.label}
          labelClassName="text-sm font-semibold text-gray-700"
          required={field.required}
          hint={field.hint}
          disabled={disabled}
        />
      );
    case "EnvVarSource":
      return (
        <FormikEnvVarSource
          name={field.key}
          label={field.hideLabel ? undefined : field.label}
          variant={field.variant}
          hint={field.hint}
          required={field.required}
          disabled={disabled}
        />
      );
    case "ConnectionSwitch":
      return (
        <FormikConnectionOptionsSwitchField field={field} disabled={disabled} />
      );

    case "SwitchField":
      return (
        <FormikSwitchField
          name={field.key}
          label={field.label}
          required={field.required}
          hint={field.hint}
          options={field.switchFieldProps?.options ?? []}
          disabled={disabled}
        />
      );

    case "authentication":
      return (
        <FormikCompactEnvVarSource
          name={field.key}
          label={field.hideLabel ? undefined : field.label}
          variant={field.variant}
          hint={field.hint}
          required={field.required}
          disabled={disabled}
        />
      );
    case "GroupField":
      return (
        <div className="flex flex-row gap-2">
          {field.groupFieldProps?.fields.map((f) => (
            <div className="flex flex-1 flex-col gap-2" key={field.key}>
              <RenderConnectionFormFields field={f} disabled={disabled} />
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}
