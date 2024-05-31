import React from "react";
import { TextArea } from "../../../TextArea/TextArea";
import { TextInput } from "../../../TextInput";

interface Props {
  name: string;
  variant: "small" | "large";
  data: {
    static: string;
    key: string;
    name: string;
  };
  setData: React.Dispatch<
    React.SetStateAction<{
      static: string;
      key: string;
      name: string;
    }>
  >;
  disabled?: boolean;
  readOnly?: boolean;
}

export default function FormikEnvVarStaticView({
  name,
  variant,
  data,
  setData,
  disabled,
  readOnly
}: Props) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData((val) => {
      return {
        ...val,
        static: e.target.value,
        key: "",
        name: ""
      };
    });
  };

  if (variant === "large") {
    return (
      <TextArea
        name={name}
        label={""}
        className="w-full h-32"
        value={data.static}
        onChange={handleChange}
        disabled={disabled}
        readOnly={readOnly}
        type="password"
      />
    );
  }

  return (
    <TextInput
      id=""
      name={name}
      label={""}
      className="w-full"
      value={data.static}
      onChange={handleChange}
      disabled={disabled}
      readOnly={readOnly}
      type="password"
    />
  );
}
