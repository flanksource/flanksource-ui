import FormikCheckbox from "../Forms/Formik/FormikCheckbox";
import { FormikCompactEnvVarSource } from "../Forms/Formik/FormikCompactEnvVarSource";
import { FormikEnvVarSource } from "../Forms/Formik/FormikEnvVarSource";
import FormikSwitchField from "../Forms/Formik/FormikSwitchField";
import FormikTextInput from "../Forms/Formik/FormikTextInput";
import FormikConnectionOptionsSwitchField from "./FormikConnectionOptionsSwitchField";
import { ConnectionFormFields, ConnectionValueType } from "./connectionTypes";
import { useFormikContext } from "formik";
import { useQuery } from "@tanstack/react-query";
import { getAllConnections } from "../../api/query-functions";

interface FieldViewProps {
  field: ConnectionFormFields;
}

export default function RenderConnectionFormFields({ field }: FieldViewProps) {
  const type = field.type ?? "input";
  
  // For ConnectionSelect type, we need to query for connections
  let connections: any[] = [];
  
  const { data: allConnections } = useQuery(['connections'], getAllConnections, {
    staleTime: 30000,
    enabled: type === "ConnectionSelect"
  });
  
  if (allConnections && field.connectionType) {
    // Filter connections by the requested connection type
    connections = allConnections.filter(
      (connection) => connection.type === field.connectionType
    );
  }
  
  switch (type) {
    case "input":
      return (
        <FormikTextInput
          name={field.key}
          label={field.label}
          required={field.required}
          hint={field.hint}
          defaultValue={field.default?.toString()}
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
        />
      );
    case "ConnectionSwitch":
      return <FormikConnectionOptionsSwitchField field={field} />;
      
    case "ConnectionSelect":
      return (
        <div className="flex flex-col space-y-1">
          <label htmlFor={field.key} className="text-sm font-semibold text-gray-700">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            id={field.key}
            name={field.key}
            className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select a connection</option>
            {connections.map((connection) => (
              <option key={connection.id} value={connection.id}>
                {connection.name}
              </option>
            ))}
          </select>
          {field.hint && <p className="text-xs text-gray-500">{field.hint}</p>}
        </div>
      );

    case "SwitchField":
      return (
        <FormikSwitchField
          name={field.key}
          label={field.label}
          required={field.required}
          hint={field.hint}
          options={field.switchFieldProps?.options ?? []}
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
        />
      );
    case "GroupField":
      return (
        <div className="flex flex-row gap-2">
          {field.groupFieldProps?.fields.map((f) => (
            <div className="flex flex-1 flex-col gap-2" key={field.key}>
              <RenderConnectionFormFields field={f} />
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}