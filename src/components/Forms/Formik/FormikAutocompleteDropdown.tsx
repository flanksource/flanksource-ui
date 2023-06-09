import { useField } from "formik";
import { useCallback, useState } from "react";
import CreatableSelect from "react-select/creatable";

type FormikSelectDropdownProps = {
  name: string;
  required?: boolean;
  label?: string;
  hint?: string;
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
  isClearable = true
}: FormikSelectDropdownProps) {
  const [isTouched, setIsTouched] = useState(false);

  const [field, meta] = useField<string>({
    name,
    type: "checkbox",
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

  return (
    <div className="flex flex-col space-y-2 py-2">
      {label && (
        <label className={`block text-sm font-semibold text-gray-700`}>
          {label}
        </label>
      )}
      <CreatableSelect
        className="h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
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
      />
      {hint && <p className="text-sm text-gray-500">{hint}</p>}
      {isTouched && meta.error ? (
        <p className="text-sm text-red-500 w-full py-1">{meta.error}</p>
      ) : null}
    </div>
  );
}
