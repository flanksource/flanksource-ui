import { useField } from "formik";
import React from "react";
import { TextInput } from "../../TextInput";

type FormikTextInputProps = {
  name: string;
  required?: boolean;
  label?: string;
  className?: string;
  hint?: string;
  hintPosition?: "top" | "bottom";
} & Omit<React.ComponentProps<typeof TextInput>, "id">;

export default function FormikTextInput({
  name,
  required = false,
  label,
  className = "flex flex-col",
  hintPosition = "bottom",
  hint,
  type = "text",
  ...props
}: FormikTextInputProps) {
  const [field, meta] = useField({
    name,
    type: type,
    required,
    validate: (value) => {
      if (required && !value) {
        return "This field is required";
      }
    }
  });

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {hint && hintPosition === "top" && (
        <p className="text-sm text-gray-500 py-1">{hint}</p>
      )}
      <TextInput {...props} id={name} type={type} {...field} />
      {hint && hintPosition === "bottom" && (
        <p className="text-sm text-gray-500 py-1">{hint}</p>
      )}
      {meta.touched && meta.error ? (
        <p className="text-sm text-red-500 w-full py-1">{meta.error}</p>
      ) : null}
    </div>
  );
}
