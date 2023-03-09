import { useField } from "formik";
import React from "react";
import { TextInput } from "../../TextInput";

type FormikTextInputProps = {
  name: string;
  required?: boolean;
  label?: string;
} & Omit<React.ComponentProps<typeof TextInput>, "id">;

export default function FormikTextInput({
  name,
  required = false,
  label,
  ...props
}: FormikTextInputProps) {
  const [field] = useField({
    name,
    type: "text",
    required
  });

  return (
    <div className="flex flex-col">
      <TextInput
        label={label}
        {...props}
        required={required}
        id={name}
        {...field}
      />
    </div>
  );
}
