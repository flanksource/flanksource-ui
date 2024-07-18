import { useFormikContext } from "formik";
import { get } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Switch } from "../../../ui/FormControls/Switch";
import FormikCheckboxFieldsGroup from "./FormikCheckboxFieldsGroup";
import FormikEnvVarConfigsFields from "./FormikConfigEnvVarFields";

type FormikAuthFieldsGroupProps = {
  name: string;
};

export default function FormikAuthFieldsGroup({
  name
}: FormikAuthFieldsGroupProps) {
  const { setFieldValue, values } = useFormikContext<Record<string, any>>();

  const [selectedMethod, setSelectedMethod] = useState<
    "None" | "Basic" | "NTLM" | "NTLMv2"
  >(() => {
    if (get(values, `${name}.basic`)) {
      return "Basic";
    }
    if (get(values, `${name}.ntlm`)) {
      return "NTLM";
    }
    if (get(values, `${name}.ntlmv2`)) {
      return "NTLMv2";
    }
    return "None";
  });

  useEffect(() => {
    if (get(values, `${name}.basic`)) {
      setSelectedMethod("Basic");
    } else if (get(values, `${name}.ntlm`)) {
      setSelectedMethod("NTLM");
    } else if (get(values, `${name}.ntlmv2`)) {
      setSelectedMethod("NTLMv2");
    } else {
      setSelectedMethod("None");
    }
  }, [name, values]);

  const setAuthenticationMethodFormValue = useCallback(
    (method: "None" | "Basic" | "NTLM" | "NTLMv2") => {
      // reset all fields
      setFieldValue(`${name}.basic`, undefined);
      setFieldValue(`${name}.ntlm`, undefined);
      setFieldValue(`${name}.ntlmv2`, undefined);

      // set the correct method
      switch (method) {
        case "Basic":
          setFieldValue(`${name}.basic`, true);
          break;
        case "NTLM":
          setFieldValue(`${name}.ntlm`, true);
          break;
        case "NTLMv2":
          setFieldValue(`${name}.ntlmv2`, true);
          break;
      }
    },
    [name, setFieldValue]
  );

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold">Authentication</label>
      <div className="flex w-full flex-row">
        <Switch
          options={["None", "Basic", "NTLM", "NTLMv2"]}
          defaultValue="None"
          value={selectedMethod}
          onChange={(v) => {
            setSelectedMethod(v as any);
            setAuthenticationMethodFormValue(v as any);
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
