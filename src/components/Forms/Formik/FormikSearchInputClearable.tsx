import { TextInputClearable } from "@flanksource-ui/ui/FormControls/TextInputClearable";
import { useField } from "formik";
import { debounce } from "lodash";
import React, { ComponentProps } from "react";

type FormikSearchInputClearableProps = {
  name: string;
  className?: string;
} & ComponentProps<typeof TextInputClearable>;

export default function FormikSearchInputClearable({
  name,
  required = false,
  className = "flex flex-col w-80",
  type = "text",
  ...props
}: FormikSearchInputClearableProps) {
  const [field] = useField({
    name,
    type: type,
    required,
    validate: (value) => {
      if (required && !value) {
        return "This field is required";
      }
    }
  });

  const onChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange({
      target: {
        value: e.target.value,
        name
      }
    });
  }, 400);

  return (
    <TextInputClearable
      {...props}
      defaultValue={field.value}
      onChange={onChange}
    />
  );
}
