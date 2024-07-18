import { useField } from "formik";
import { useEffect, useState } from "react";
import { Switch } from "../../../ui/FormControls/Switch";
import {
  EnvVarSourceType,
  FormikEnvVarSourceProps,
  configmapValueRegex,
  secretValueRegex
} from "./FormikEnvVarSource";
import FormikEnvVarK8SView from "./utils/FormikEnvVarK8SView";
import FormikEnvVarStaticView from "./utils/FormikEnvVarStaticView";

export function FormikCompactEnvVarSource({
  className,
  variant = "small",
  name,
  label,
  hint,
  disabled,
  readOnly,
  required,
  ...props
}: FormikEnvVarSourceProps) {
  const [type, setType] = useState<EnvVarSourceType>("Static");
  const prefix = `${name}.${type === "ConfigMap" ? "configmap" : "secret"}`;
  const [data, setData] = useState({
    static: "",
    name: "",
    key: ""
  });
  const [field, meta] = useField({
    name: name!,
    type: "text",
    required,
    validate: (value) => {
      if (required && !value) {
        return "This field is required";
      }
    }
  });

  useEffect(() => {
    const value = getValue();
    if (field.value !== value) {
      field.onChange({
        target: {
          name,
          value
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (field.value === getValue()) {
      return;
    }
    let value =
      field.value?.match(configmapValueRegex) ||
      field.value?.match(secretValueRegex);
    if (value?.length === 3 && field.value?.includes("configmap")) {
      setData({
        static: "",
        key: value[2],
        name: value[1]
      });
      setType("ConfigMap");
      return;
    }
    if (value?.length === 3 && field.value?.includes("secret")) {
      setData({
        static: "",
        key: value[2],
        name: value[1]
      });
      setType("Secret");
      return;
    }
    setData({
      static: field.value,
      key: "",
      name: ""
    });
    setType("Static");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getValue = () => {
    let value = "";
    if (type === "Static") {
      value = data.static;
    }
    if (type === "Secret" && data.name && data.key) {
      value = `secret://${data.name}/${data.key}`;
    }
    if (type === "ConfigMap" && data.name && data.key) {
      value = `configmap://${data.name}/${data.key}`;
    }
    return value;
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold">{label}</label>
      <div className="flex flex-row gap-2">
        <div className="w-full">
          {type === "Static" ? (
            <FormikEnvVarStaticView
              name="name"
              variant="small"
              disabled={disabled}
              readOnly={readOnly}
              data={data}
              setData={setData}
            />
          ) : (
            <FormikEnvVarK8SView
              prefix={prefix}
              data={data}
              setData={setData}
              className="flex flex-row items-center gap-2"
            />
          )}
          {meta.touched && meta.error ? (
            <p className="w-full py-1 text-sm text-red-500">{meta.error}</p>
          ) : null}
        </div>
        <Switch
          options={["Static", "Secret", "ConfigMap"]}
          defaultValue={"None"}
          value={type}
          onChange={(v) => {
            if (readOnly || disabled) {
              return;
            }
            setData({
              static: "",
              key: "",
              name: ""
            });
            setType(v as EnvVarSourceType);
          }}
          className="w-[24rem]"
        />
      </div>
      {hint && <p className="py-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
