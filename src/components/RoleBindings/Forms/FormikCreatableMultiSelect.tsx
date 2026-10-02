import { useField } from "formik";
import { useMemo } from "react";
import CreatableSelect from "react-select/creatable";

export type CreatableOption = {
  value: string;
  label: string;
  description?: string;
};

type FormikCreatableMultiSelectProps = {
  name: string;
  label: string;
  hint?: string;
  options: CreatableOption[];
  isLoading?: boolean;
  placeholder?: string;
  // Keeps the label for screen readers when a heading above already names the field
  hideLabel?: boolean;
};

// A multi-select of string values that also accepts values that aren't listed,
// e.g. the email of someone who hasn't signed in yet.
export default function FormikCreatableMultiSelect({
  name,
  label,
  hint,
  options,
  isLoading = false,
  placeholder,
  hideLabel = false
}: FormikCreatableMultiSelectProps) {
  const [field, meta, helpers] = useField<string[]>(name);

  const value = useMemo(
    () =>
      (field.value ?? []).map(
        (item) =>
          options.find((option) => option.value === item) ?? {
            value: item,
            label: item
          }
      ),
    [field.value, options]
  );

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className={hideLabel ? "sr-only" : "text-sm font-medium text-gray-700"}
      >
        {label}
      </label>
      <CreatableSelect<CreatableOption, true>
        inputId={name}
        isMulti
        isLoading={isLoading}
        options={options}
        value={value}
        placeholder={placeholder}
        formatOptionLabel={(option) => (
          <div className="flex items-center justify-between gap-2">
            <span>{option.label}</span>
            {option.description && (
              <span className="text-xs text-gray-500">
                {option.description}
              </span>
            )}
          </div>
        )}
        onChange={(selected) =>
          helpers.setValue(selected.map((option) => option.value))
        }
        onBlur={() => helpers.setTouched(true)}
        className="text-sm"
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : undefined
        }
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {meta.error && typeof meta.error === "string" && (
        <p className="text-sm text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
