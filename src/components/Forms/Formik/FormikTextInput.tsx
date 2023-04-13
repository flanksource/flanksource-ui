import { useField } from "formik";
import React from "react";
import { TextInput } from "../../TextInput";

type FormikTextInputProps = {
  name: string;
  required?: boolean;
  label?: string;
  className?: string;
  hint?: string;
} & Omit<React.ComponentProps<typeof TextInput>, "id">;

export default function FormikTextInput({
  name,
  required = false,
  label,
  className = "flex flex-col",
  hint,
  ...props
}: FormikTextInputProps) {
  const [field] = useField({
    name,
    type: "text",
    required
  });

  return (
    <div className={className}>
      <TextInput
        label={label}
        {...props}
        required={required}
        id={name}
        {...field}
      />
      {hint && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
