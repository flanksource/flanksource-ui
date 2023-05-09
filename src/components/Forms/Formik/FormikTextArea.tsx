import { useField } from "formik";
import React from "react";
import { TextArea } from "../../TextArea/TextArea";

type FormikTextAreaProps = {
  name: string;
  required?: boolean;
  label?: string;
  hint?: string;
} & Omit<React.ComponentProps<typeof TextArea>, "id">;

export default function FormikTextArea({
  name,
  required = false,
  label,
  className = "flex flex-col",
  hint,
  ...props
}: FormikTextAreaProps) {
  const [field, meta] = useField({
    name,
    type: "text",
    required,
    validate: (value) => {
      if (required && !value) {
        return "This field is required";
      }
    }
  });

  return (
    <div className={className}>
      <TextArea
        label={label}
        {...props}
        required={required}
        id={name}
        {...field}
      />
      {hint && <p className="text-sm text-gray-500 py-1">{hint}</p>}
      {meta.touched && meta.error ? (
        <p className="text-sm text-red-500 w-full py-1">{meta.error}</p>
      ) : null}
    </div>
  );
}
