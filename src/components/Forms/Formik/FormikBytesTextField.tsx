import { useField } from "formik";
import React, { useCallback, useMemo } from "react";
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

export default function FormikBytesTextField({
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

  const [unit, setUnit] = React.useState<"Mi" | "Gi" | "Ti">(() => {
    if (!field.value) {
      return "Mi";
    }
    // get the last two characters of the value, if it's 'Mi', 'Gi', or 'Ti'
    const unit = field.value?.toString().slice(-2);
    if (unit === "Mi" || unit === "Gi" || unit === "Ti") {
      return unit as "Mi" | "Gi" | "Ti";
    }
    return "Mi";
  });

  // convert value to bytes
  const value = useMemo(() => {
    if (field.value) {
      switch (unit) {
        case "Mi":
          return field.value.toString().replace(/Mi$/, "");
        case "Gi":
          return field.value.toString().replace(/Gi$/, "");
        case "Ti":
          return field.value.toString().replace(/Ti$/, "");
        default:
          return "";
      }
    } else {
      return "";
    }
  }, [field.value, unit]);

  const onChange = useCallback(
    (v: string, unit: "Mi" | "Gi" | "Ti") => {
      // convert to bytes
      const bytes = v ? `${v}${unit}` : undefined;
      field.onChange({
        target: {
          name: name,
          value: bytes
        }
      });
    },
    [field, name]
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
          onChange={(e) => onChange(e.target.value, unit)}
          required={required}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <label htmlFor={`${name}-unit`} className="sr-only">
            Unit
          </label>
          <select
            id={`${name}-unit`}
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value as "Mi" | "Gi" | "Ti");
              onChange(value, e.target.value as "Mi" | "Gi" | "Ti");
            }}
            name="unit"
            className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          >
            <option>Mi</option>
            <option>Gi</option>
            <option>Ti</option>
          </select>
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
