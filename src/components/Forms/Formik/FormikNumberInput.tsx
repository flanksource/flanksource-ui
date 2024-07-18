import { useField } from "formik";
import React from "react";
import { TextInput } from "../../../ui/FormControls/TextInput";

type FormikNumberInputProps = {
  name: string;
  required?: boolean;
  label?: string;
  className?: string;
  hint?: string;
} & Omit<React.ComponentProps<typeof TextInput>, "id">;

export default function FormikNumberInput({
  name,
  required = false,
  label,
  className = "flex flex-col",
  hint,
  ...props
}: FormikNumberInputProps) {
  const [field, meta] = useField({
    name,
    type: "number",
    required,
    validate: (value) => {
      if (required && !value) {
        return "This field is required";
      }
      if (value && isNaN(value)) {
        return "This field must be a number";
      }
    }
  });

  return (
    <div className={className}>
      <TextInput
        label={label}
        {...props}
        id={name}
        type="number"
        {...field}
        onChange={() => {
          const value = field.value;
          if (value) {
            field.onChange({ target: { value: parseInt(value) } });
          }
        }}
      />
      {hint && <p className="py-1 text-sm text-gray-500">{hint}</p>}
      {meta.touched && meta.error ? (
        <p className="w-full py-1 text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
}
