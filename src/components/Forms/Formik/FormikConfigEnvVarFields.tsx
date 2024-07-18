import { useFormikContext } from "formik";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { Switch } from "../../../ui/FormControls/Switch";
import FormikTextInput from "./FormikTextInput";
import FormikTextArea from "./FormikTextArea";
import HelpLink from "@flanksource-ui/ui/Buttons/HelpLink";

type FormikConfigEnvVarFieldsProps = {
  name: string;
  className?: string;
  type?: string;
  hint?: string;
  label?: string;
};

/**
 *
 * FormikConfigEnvVarFields
 *
 * Renders Formik form fields needed to edit a Config Env Var object.
 *
 * Does not have a label, needs to be wrapped in a Label container.
 *
 */
export default function FormikEnvVarConfigsFields({
  name,
  className = "flex flex-col space-y-2 w-full",
  hint,
  type = "password",
  label
}: FormikConfigEnvVarFieldsProps) {
  const [selectedMethod, setSelectedMethod] = useState<
    "Static" | "Secret" | "Config Map"
  >("Static");

  const { values, setFieldValue } = useFormikContext();

  const value = get(values, name);

  useEffect(() => {
    if (value) {
      if (value.value) {
        setSelectedMethod("Static");
        return;
      }
      if (value.valueFrom) {
        if (value.valueFrom.secretKeyRef) {
          setSelectedMethod("Secret");
        } else if (value.valueFrom.configMapKeyRef) {
          setSelectedMethod("Config Map");
        }
      } else {
        setSelectedMethod("Static");
      }
    }
  }, [value]);

  const onChangeMethod = (method: "Static" | "Secret" | "Config Map") => {
    if (method === "Static") {
      setFieldValue(`${name}.value`, undefined);
    } else {
      setFieldValue(`${name}.valueFrom`, undefined);
    }
    setSelectedMethod(method);
  };

  return (
    <div className={className}>
      <div className="flex w-full flex-row items-center gap-4">
        {label && (
          <label className="flex-shrink text-sm font-semibold">{label}</label>
        )}
      </div>
      <div className="flex flex-col gap-2 py-2">
        <div className="flex flex-row items-center gap-2">
          {selectedMethod === "Static" && (
            <div className="flex flex-1 flex-col">
              {type === "textarea" && (
                <FormikTextArea
                  name={`${name}.value`}
                  className="flex flex-col gap-0"
                  type={type}
                />
              )}
              {type !== "textarea" && (
                <FormikTextInput
                  name={`${name}.value`}
                  className="flex flex-col gap-0"
                  type={type}
                />
              )}
            </div>
          )}

          {selectedMethod === "Config Map" && (
            <div className="flex flex-1 flex-row gap-2">
              <div className="flex flex-1 flex-row items-center gap-2">
                <label className="flex-shrink text-sm font-semibold">
                  ConfigMap Name:
                </label>
                <FormikTextInput
                  name={`${name}.valueFrom.configMapKeyRef.name`}
                  className="flex flex-1 flex-col gap-0"
                />
              </div>
              <div className="flex flex-1 flex-row items-center gap-2">
                <label className="flex-shrink text-sm font-semibold">
                  ConfigMap Key:
                </label>
                <FormikTextInput
                  name={`${name}.valueFrom.configMapKeyRef.key`}
                  className="flex flex-1 flex-col gap-0"
                />
              </div>
            </div>
          )}

          {selectedMethod === "Secret" && (
            <div className="flex flex-1 flex-row gap-2">
              <div className="flex flex-1 flex-row items-center gap-2">
                <label className="flex-shrink text-sm font-semibold">
                  Secret Name:
                </label>
                <FormikTextInput
                  name={`${name}.valueFrom.secretKeyRef.name`}
                  className="flex flex-1 flex-col gap-0"
                />
              </div>
              <div className="flex flex-1 flex-row items-center gap-2">
                <label className="flex-shrink text-sm font-semibold">
                  Secret Key:
                </label>
                <FormikTextInput
                  name={`${name}.valueFrom.secretKeyRef.key`}
                  className="flex flex-1 flex-col gap-0"
                />
              </div>
            </div>
          )}
          <div className="flex-col-2 mb-auto flex flex-shrink-0">
            <Switch
              className="w-full"
              value={selectedMethod}
              options={["Static", "Config Map", "Secret"]}
              onChange={(v) => {
                onChangeMethod(v as "Static" | "Config Map" | "Secret");
              }}
            />
            <HelpLink link="reference/env-var" />
          </div>
        </div>
        {hint && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
    </div>
  );
}
