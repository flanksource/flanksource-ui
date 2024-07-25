import { useField } from "formik";
import React from "react";
import { TextInput } from "../../../ui/FormControls/TextInput";
import { IconPicker } from "../../../ui/Icons/IconPicker";

type FormikIconPickerProps = {
  name: string;
  required?: boolean;
  label?: string;
  className?: string;
  hint?: string;
} & Omit<React.ComponentProps<typeof TextInput>, "id">;

export default function FormikIconPicker({
  name,
  required = false,
  label,
  className = "flex flex-col",
  hint,
  type = "text"
}: FormikIconPickerProps) {
  const [field, meta] = useField({
    name,
    type: type,
    required
  });

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <IconPicker
        onChange={(value) =>
          field.onChange({ target: { value: value.value, name } })
        }
        icon={field.value}
        className="w-full"
        name={name}
      />
      {hint && <p className="text-sm text-gray-500">{hint}</p>}
      {meta.touched && meta.error ? (
        <p className="w-full text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
}
