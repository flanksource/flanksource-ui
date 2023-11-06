import React from "react";
import { TextInput } from "../../../TextInput";

interface Props {
  prefix: string;
  data: {
    name: string;
    key: string;
    static: string;
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      key: string;
      static: string;
    }>
  >;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

export default function FormikEnvVarK8SView({
  prefix,
  data,
  setData,
  disabled,
  readOnly,
  className = "flex flex-col gap-2"
}: Props) {
  const handleChange = (name: string, value: string) => {
    setData((val) => {
      return {
        ...val,
        [name]: value,
        static: ""
      };
    });
  };

  return (
    <div className={className}>
      <TextInput
        id=""
        name={`${prefix}.name`}
        label="Name"
        className="w-full"
        value={data.name}
        onChange={(e) => handleChange("name", e.target.value)}
        disabled={disabled}
        readOnly={readOnly}
      />
      <TextInput
        id=""
        name={`${prefix}.key`}
        label="Key"
        className="w-full"
        value={data.key}
        onChange={(e) => handleChange("key", e.target.value)}
        disabled={disabled}
        readOnly={readOnly}
      />
    </div>
  );
}
