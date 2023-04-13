import { useField } from "formik";
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
};

export default function FormikSelectDropdown({
  name,
  required = false,
  label,
  options,
  hint
}: FormikSelectDropdownProps) {
  const [field] = useField<string>({
    name,
    type: "checkbox",
    required
  });

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label className={`block text-sm font-bold text-gray-700`}>
          {label}
        </label>
      )}
      <CreatableSelect
        className="h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 sm:text-sm border-gray-300 rounded-md"
        onChange={(value) => {
          field.onChange({
            target: {
              name: field.name,
              value: value?.value
            }
          });
        }}
        value={{
          label: field.value,
          value: field.value
        }}
        options={options}
      />
      {hint && <p className="text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
