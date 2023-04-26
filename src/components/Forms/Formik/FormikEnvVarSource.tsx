import { useEffect, useState } from "react";
import { Switch } from "../../Switch";
import { TextInput } from "../../TextInput";
import { TextArea } from "../../TextArea/TextArea";
import { useField } from "formik";

type FormikEnvVarSourceProps = React.HTMLProps<
  HTMLInputElement | HTMLTextAreaElement
> & {
  variant?: "small" | "large";
};

type EnvVarSourceType = "Static" | "K8S Secret" | "K8S Configmap";

const configmapValueRegex = /^configmap:\/\/(.+)?\/(.+)?/;
const secretValueRegex = /^secret:\/\/(.+)?\/(.+)?/;

export function FormikEnvVarSource({
  className,
  variant = "small",
  name,
  label,
  disabled,
  readOnly,
  ...props
}: FormikEnvVarSourceProps) {
  const [type, setType] = useState<EnvVarSourceType>("Static");
  const prefix = `${name}.${type === "K8S Configmap" ? "configmap" : "secret"}`;
  const [data, setData] = useState({
    static: "",
    name: "",
    key: ""
  });
  const [field] = useField({
    name: name!,
    type: "text",
    required: props.required
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
  }, [data]);

  useEffect(() => {
    if (field.value === getValue()) {
      return;
    }
    let value = field.value?.match(configmapValueRegex);
    value = value || field.value?.match(secretValueRegex);
    if (value?.length === 3 && field.value?.includes("configmap")) {
      setData({
        static: "",
        key: value[2],
        name: value[1]
      });
      setType("K8S Configmap");
      return;
    }
    if (value?.length === 3 && field.value?.includes("secret")) {
      setData({
        static: "",
        key: value[2],
        name: value[1]
      });
      setType("K8S Secret");
      return;
    }
    setData({
      static: field.value,
      key: "",
      name: ""
    });
    setType("Static");
  }, []);

  const getValue = () => {
    let value = "";
    if (type === "Static") {
      value = data.static;
    }
    if (type === "K8S Secret") {
      value = `configmap://${data.name}/${data.key}`;
    }
    if (type === "K8S Configmap") {
      value = `secret://${data.name}/${data.key}`;
    }
    return value;
  };

  const getStaticView = () => {
    if (variant === "large") {
      return (
        <TextArea
          name={name!}
          label={""}
          className="w-full h-32"
          value={data.static}
          onChange={(e) => {
            setData((val) => {
              return {
                ...val,
                static: e.target.value,
                key: "",
                name: ""
              };
            });
          }}
          disabled={disabled}
          readOnly={readOnly}
        />
      );
    }
    return (
      <TextInput
        id=""
        name={name!}
        label={""}
        className="w-full"
        value={data.static}
        onChange={(e) => {
          setData((val) => {
            return {
              ...val,
              static: e.target.value,
              key: "",
              name: ""
            };
          });
        }}
        disabled={disabled}
        readOnly={readOnly}
      />
    );
  };

  const getK8SView = () => {
    return (
      <div className="flex flex-col space-y-2">
        {variant === "large" && (
          <TextArea
            id=""
            name={`${prefix}.name`}
            label="Name"
            className="w-full h-32"
            value={data.name}
            onChange={(e) => {
              setData((val) => {
                return {
                  ...val,
                  name: e.target.value,
                  static: ""
                };
              });
            }}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}
        {variant === "small" && (
          <TextInput
            id=""
            name={`${prefix}.name`}
            label="Name"
            className="w-full"
            value={data.name}
            onChange={(e) => {
              setData((val) => {
                return {
                  ...val,
                  name: e.target.value,
                  static: ""
                };
              });
            }}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}
        {variant === "large" && (
          <TextArea
            id=""
            name={`${prefix}.key`}
            label="Key"
            className="w-full h-32"
            value={data.key}
            onChange={(e) => {
              setData((val) => {
                return {
                  ...val,
                  key: e.target.value,
                  static: ""
                };
              });
            }}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}
        {variant === "small" && (
          <TextInput
            id=""
            name={`${prefix}.key`}
            label="Key"
            className="w-full"
            value={data.key}
            onChange={(e) => {
              setData((val) => {
                return {
                  ...val,
                  key: e.target.value,
                  static: ""
                };
              });
            }}
            disabled={disabled}
            readOnly={readOnly}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-semibold text-sm">{label}</label>
      <div className="flex flex-col space-y-2">
        <Switch
          options={["Static", "K8S Secret", "K8S Configmap"]}
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
        <div className="w-full">
          {type === "Static" && getStaticView()}
          {type === "K8S Secret" && getK8SView()}
          {type === "K8S Configmap" && getK8SView()}
        </div>
      </div>
    </div>
  );
}
