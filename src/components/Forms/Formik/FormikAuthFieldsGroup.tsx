import { useState } from "react";
import { Switch } from "../../Switch";
import { useField, useFormikContext } from "formik";
import FormikCheckboxFieldsGroup from "./FormikCheckboxFieldsGroup";
import FormikEnvVarConfigsFields from "./FormikConfigEnvVarFields";

type FormikAuthFieldsGroupProps = {
  name: string;
};

export default function FormikAuthFieldsGroup({
  name
}: FormikAuthFieldsGroupProps) {
  const [field] = useField(`${name}.method`);

  const [selectedMethod, setSelectedMethod] = useState<
    "None" | "Basic" | "NTLM" | "NTLMv2"
  >(field.value ?? "None");

  const { setFieldValue } = useFormikContext<Record<string, any>>();

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-semibold text-sm">Authentication</label>
      <Switch
        options={["None", "Basic", "NTLM", "NTLMv2"]}
        defaultValue="None"
        value={selectedMethod}
        onChange={(v) => {
          setSelectedMethod(v as any);
          setFieldValue(`${name}.authenticationMethod`, v);
        }}
      />
      {selectedMethod !== "None" && (
        <div className="flex flex-col p-4 space-y-2 border border-gray-200 rounded-md">
          <FormikCheckboxFieldsGroup name={`${name}.username`} label="Username">
            <FormikEnvVarConfigsFields name={`${name}.username`} />
          </FormikCheckboxFieldsGroup>
          <FormikCheckboxFieldsGroup name={`${name}.password`} label="Password">
            <FormikEnvVarConfigsFields name={`${name}.password`} />
          </FormikCheckboxFieldsGroup>
        </div>
      )}
    </div>
  );
}
