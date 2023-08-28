import { useFormikContext } from "formik";
import { get } from "lodash";
import { useState, useEffect, useCallback } from "react";
import FormikCheckboxFieldsGroup from "./FormikCheckboxFieldsGroup";
import FormikEnvVarConfigsFields from "./FormikConfigEnvVarFields";
import { Switch } from "../../Switch";

type FormikAuthFieldsProps = {
  name: string;
  fields: {
    name: string;
    label: string;
  }[];
  label?: string;
};

export default function FormikAuthFields({
  name,
  fields,
  label = "Authentication"
}: FormikAuthFieldsProps) {
  const { setFieldValue, values } = useFormikContext<Record<string, any>>();

  const [selectedMethod, setSelectedMethod] = useState<"None" | string>(() => {
    fields.forEach((field) => {
      if (get(values, `${name}.${field.name}`)) {
        return field.name;
      }
    });
    return "None";
  });

  useEffect(() => {
    fields.forEach((field) => {
      if (get(values, `${name}.${field.name}`)) {
        setSelectedMethod(field.name);
      }
    });
  }, [fields, name, values]);

  const setAuthenticationMethodFormValue = useCallback(
    (method: "None" | string) => {
      // reset all fields
      fields.forEach((field) => {
        setFieldValue(`${name}.${field.name}`, undefined);
      });

      // set the correct method
      fields.forEach((field) => {
        if (field.name === method) {
          setFieldValue(`${name}.${field.name}`, true);
        }
      });
    },
    [fields, name, setFieldValue]
  );

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-semibold text-sm">{label}</label>
      <div className="flex flex-row w-full">
        <Switch
          options={fields.map((field) => field.label)}
          defaultValue="None"
          value={selectedMethod}
          onChange={(v) => {
            setSelectedMethod(v);
            setAuthenticationMethodFormValue(v);
          }}
        />
      </div>
      {selectedMethod !== "None" && (
        <div className="flex flex-col p-2">
          <FormikCheckboxFieldsGroup
            name={`${name}.authentication.username`}
            label="Username"
          >
            <FormikEnvVarConfigsFields
              name={`${name}.authentication.username`}
            />
          </FormikCheckboxFieldsGroup>
          <FormikCheckboxFieldsGroup
            name={`${name}.authentication.password`}
            label="Password"
          >
            <FormikEnvVarConfigsFields
              name={`${name}.authentication.password`}
            />
          </FormikCheckboxFieldsGroup>
        </div>
      )}
    </div>
  );
}
