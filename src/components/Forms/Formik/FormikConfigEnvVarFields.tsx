import { useFormikContext } from "formik";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { Switch } from "../../Switch";
import FormikTextInput from "./FormikTextInput";

type FormikConfigEnvVarFieldsProps = {
  name: string;
  className?: string;
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
      <div className="flex flex-row gap-4 w-full items-center">
        {label && (
          <label className="font-semibold text-sm flex-shrink">{label}:</label>
        )}
      </div>
      <div className="flex flex-col px-2 py-2 gap-2 ">
        <div className="flex flex-row gap-2 items-center">
          {selectedMethod === "Static" && (
            <div className="flex flex-1 flex-col">
              <FormikTextInput
                name={`${name}.value`}
                className="flex flex-col gap-0"
              />
            </div>
          )}

          {selectedMethod === "Config Map" && (
            <div className="flex flex-1 flex-row gap-2">
              <div className="flex flex-row gap-2 flex-1 items-center">
                <label className="font-semibold text-sm flex-shrink">
                  Name:
                </label>
                <FormikTextInput
                  name={`${name}.valueFrom.configMapKeyRef.name`}
                  className="flex flex-col gap-0 flex-1"
                />
              </div>
              <div className="flex flex-row gap-2 flex-1 items-center">
                <label className="font-semibold text-sm flex-shrink">
                  Key:
                </label>
                <FormikTextInput
                  name={`${name}.valueFrom.configMapKeyRef.key`}
                  className="flex flex-col gap-0 flex-1"
                />
              </div>
            </div>
          )}

          {selectedMethod === "Secret" && (
            <div className="flex flex-row gap-2 flex-1">
              <div className="flex flex-row gap-2 flex-1 items-center">
                <label className="font-semibold text-sm flex-shrink">
                  Name:
                </label>
                <FormikTextInput
                  name={`${name}.valueFrom.secretKeyRef.name`}
                  className="flex flex-col gap-0 flex-1"
                />
              </div>
              <div className="flex flex-row gap-2 flex-1 items-center">
                <label className="font-semibold text-sm flex-shrink">
                  Key:
                </label>
                <FormikTextInput
                  name={`${name}.valueFrom.secretKeyRef.key`}
                  className="flex flex-col gap-0 flex-1"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col flex-shrink-0">
            <Switch
              className="w-full"
              value={selectedMethod}
              options={["Static", "Config Map", "Secret"]}
              onChange={(v) => {
                onChangeMethod(v);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
