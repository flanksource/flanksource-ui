import { useField } from "formik";
import React from "react";
import { TextArea } from "../../../ui/FormControls/TextArea";

type FormikTextAreaProps = {
  name: string;
  required?: boolean;
  label?: string;
  hint?: string;
} & Omit<React.HTMLProps<HTMLTextAreaElement>, "id">;

export default function FormikTextArea({
  name,
  required = false,
  label,
  className = "flex flex-col",
  hint,
  defaultValue,
  ...props
}: FormikTextAreaProps) {
  const [field, meta] = useField<string>({
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
        defaultValue={defaultValue as string}
        required={required}
        id={name}
        {...field}
        className="resize-none"
      />
      {hint && <p className="py-1 text-sm text-gray-500">{hint}</p>}
      {meta.touched && meta.error ? (
        <p className="w-full py-1 text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
}
