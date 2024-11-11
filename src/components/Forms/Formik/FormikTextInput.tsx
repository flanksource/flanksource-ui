import { useField } from "formik";
import React from "react";
import { TextInput } from "../../../ui/FormControls/TextInput";

export type FormikTextInputProps = {
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
      <div className="flex flex-1 flex-col">
        {hint && hintPosition === "top" && (
          <p className="py-1 text-sm text-gray-500">{hint}</p>
        )}
        <TextInput {...props} id={name} type={type} {...field} />
        {hint && hintPosition === "bottom" && (
          <p className="py-1 text-sm text-gray-500">{hint}</p>
        )}
        {meta.touched && meta.error ? (
          <p className="w-full py-1 text-sm text-red-500">{meta.error}</p>
        ) : null}
      </div>
    </div>
  );
}
