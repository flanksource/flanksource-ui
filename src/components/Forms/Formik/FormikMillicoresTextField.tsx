import { useField } from "formik";
import React, { useCallback } from "react";
import { TextInput } from "../../../ui/FormControls/TextInput";
import TextInputWithSuffix from "./utils/TextInputWithSuffix";

type FormikTextInputProps = {
  name: string;
  required?: boolean;
  label?: string;
  className?: string;
  hint?: string;
  hintPosition?: "top" | "bottom";
} & Omit<React.ComponentProps<typeof TextInput>, "id" | "value">;

export default function FormikMillicoresTextField({
  name,
  required = false,
  label,
  className = "flex flex-col",
  hintPosition = "bottom",
  hint,
  type = "text",
  ...props
}: FormikTextInputProps) {
  const [field, meta] = useField<number>({
    name,
    type: type,
    required,
    validate: (value) => {
      if (required && !value) {
        return "This field is required";
      }
    }
  });

  // remove the last character of the value, if it's 'm'
  const value = field.value ? field.value.toString().replace(/m$/, "") : "";

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      field.onChange({
        target: {
          name: e.target.name,
          value: e.target.value ? `${e.target.value}m` : undefined
        }
      });
    },
    [field]
  );

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {hint && hintPosition === "top" && (
        <p className="py-1 text-sm text-gray-500">{hint}</p>
      )}
      <div className="relative mt-2 rounded-md shadow-sm">
        <TextInputWithSuffix
          id={name}
          value={value}
          type="number"
          name={name}
          aria-describedby={label}
          onChange={onChange}
          required={required}
          {...props}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="millicores-unit">
            m
          </span>
        </div>
      </div>
      {hint && hintPosition === "bottom" && (
        <p className="py-1 text-sm text-gray-500">{hint}</p>
      )}
      {meta.touched && meta.error ? (
        <p className="w-full py-1 text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
}
