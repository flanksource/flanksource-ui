import { useField } from "formik";
import React from "react";
import { TextArea } from "../../TextArea/Textarea";

type FormikTextAreaProps = {
  name: string;
  required?: boolean;
  label?: string;
} & Omit<React.ComponentProps<typeof TextArea>, "id">;

export default function FormikTextArea({
  name,
  required = false,
  label,
  ...props
}: FormikTextAreaProps) {
  const [field] = useField({
    name,
    type: "text",
    required
  });

  return (
    <div className="flex flex-col">
      <TextArea
        label={label}
        {...props}
        required={required}
        id={name}
        {...field}
      />
    </div>
  );
}
