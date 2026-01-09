import { useField } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";

const DEFAULT_DURATION_OPTIONS = [
  "5m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "8h",
  "1d",
  "2d",
  "3d",
  "7d",
  "30d"
];

type DurationOption = {
  label: string;
  value: string;
};

type FormikDurationDropdownProps = {
  name: string;
  required?: boolean;
  options?: string[];
  min?: string;
  max?: string;
  hint?: string;
  hintPosition?: "top" | "bottom";
  className?: string;
  placeholder?: string;
};

const normalizeDurationOptions = (options?: string[]): DurationOption[] => {
  return (options ?? DEFAULT_DURATION_OPTIONS).map((option) => ({
    label: option,
    value: option
  }));
};

export default function FormikDurationDropdown({
  name,
  required = false,
  options,
  hint,
  hintPosition = "bottom",
  className = "flex flex-col py-2",
  placeholder = "Select duration"
}: FormikDurationDropdownProps) {
  const [isTouched, setIsTouched] = useState(false);

  const [field, meta] = useField<string>({
    name,
    type: "text",
    required,
    validate: useCallback(
      (value: string) => {
        if (required && !value) {
          return "This field is required";
        }
      },
      [required]
    )
  });

  const optionsList = useMemo(
    () => normalizeDurationOptions(options),
    [options]
  );

  const value = useMemo(() => {
    if (!field.value) {
      return null;
    }
    const existing = optionsList.find((item) => item.value === field.value);
    return existing ?? { label: field.value, value: field.value };
  }, [field.value, optionsList]);

  useEffect(() => {
    setIsTouched(isTouched || meta.touched || meta.initialTouched);
  }, [isTouched, meta.initialTouched, meta.touched]);

  return (
    <div className={className}>
      {hint && hintPosition === "top" && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
      <CreatableSelect<DurationOption>
        className="h-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        name={field.name}
        options={optionsList}
        value={value}
        placeholder={placeholder}
        onChange={(selected) => {
          field.onChange({
            target: {
              name: field.name,
              value: selected?.value ?? ""
            }
          });
          setIsTouched(true);
        }}
        onBlur={(event) => {
          field.onBlur(event);
          setIsTouched(true);
        }}
        onFocus={() => {
          setIsTouched(true);
        }}
        isClearable={Boolean(field.value?.trim())}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
        menuPosition="fixed"
        menuShouldBlockScroll={true}
      />
      {hint && hintPosition === "bottom" && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
      {isTouched && meta.error ? (
        <p className="w-full py-1 text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
}
