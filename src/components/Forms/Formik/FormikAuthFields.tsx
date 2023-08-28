import { useFormikContext } from "formik";
import { get } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Switch } from "../../Switch";
import FormikEnvVarConfigsFields from "./FormikConfigEnvVarFields";

type FormikAuthFieldsProps = {
  name: string;
  types: {
    value: {
      [key: string]: boolean;
    };
    label: string;
  }[];
  label?: string;
};

export default function FormikAuthFields({
  name,
  types,
  label = "Authentication"
}: FormikAuthFieldsProps) {
  const { setFieldValue, values } = useFormikContext<Record<string, any>>();

  const [selectedMethod, setSelectedMethod] = useState<"None" | string>(() => {
    types.forEach((field) => {
      console.log("field", field);
      if (get(values, `${name}.${Object.keys(field.value)[0]}`)) {
        return field.label;
      }
    });
    return "None";
  });

  useEffect(() => {
    types.forEach((field) => {
      if (get(values, `${name}.${Object.keys(field.value)[0]}`)) {
        setSelectedMethod(field.label);
      }
    });
  }, [types, name, values]);

  const setAuthenticationMethodFormValue = useCallback(
    (method: "None" | string) => {
      // reset all fields
      types.forEach((field) => {
        setFieldValue(`${name}.${Object.keys(field.value)[0]}`, undefined);
      });

      if (method === "None") {
        return;
      }

      // set the correct method
      const selectedItem = types.find((field) => field.label === method);
      if (selectedItem) {
        setFieldValue(`${name}.${Object.keys(selectedItem.value)[0]}`, true);
      }
    },
    [types, name, setFieldValue]
  );

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-semibold text-sm">{label}</label>
      <div className="flex flex-row w-full">
        <Switch
          options={["None", ...types.map((field) => field.label)]}
          defaultValue="None"
          value={selectedMethod}
          onChange={(v) => {
            setSelectedMethod(v);
            setAuthenticationMethodFormValue(v);
          }}
        />
      </div>
      {selectedMethod !== "None" && (
        <div className="flex flex-col gap-4 p-2">
          <FormikEnvVarConfigsFields
            label="Username"
            name={`${name}.authentication.username`}
          />

          <FormikEnvVarConfigsFields
            label="Password"
            name={`${name}.authentication.password`}
          />
        </div>
      )}
    </div>
  );
}
