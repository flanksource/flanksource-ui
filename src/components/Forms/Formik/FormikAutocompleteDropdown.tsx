import { useField } from "formik";
import { useCallback, useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

export type FormikSelectDropdownProps = {
  name: string;
  required?: boolean;
  label?: string;
  hint?: string;
  hintPosition?: "top" | "bottom";
  options: {
    value: string;
    label: string;
  }[];
  isClearable?: boolean;
};

export default function FormikAutocompleteDropdown({
  name,
  required = false,
  label,
  options,
  hint,
  hintPosition = "bottom",
  isClearable = true
}: FormikSelectDropdownProps) {
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

  useEffect(() => {
    setIsTouched(isTouched || meta.touched || meta.initialTouched);
  }, [isTouched, meta.initialTouched, meta.touched]);

  return (
    <div className="flex flex-col">
      {label && <label className="form-label mb-0">{label}</label>}
      {hint && hintPosition === "top" && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
      <CreatableSelect
        className="h-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        onChange={(value) => {
          field.onChange({
            target: {
              name: field.name,
              value: value?.value
            }
          });
          setIsTouched(true);
        }}
        value={options.find((item) => item.value === field.value)}
        options={options}
        onBlur={(event) => {
          field.onBlur(event);
          setIsTouched(true);
        }}
        onFocus={(event) => {
          field.onBlur(event);
          setIsTouched(true);
        }}
        name={field.name}
        isClearable={isClearable && Boolean(field.value?.trim())}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
        menuPosition={"fixed"}
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
