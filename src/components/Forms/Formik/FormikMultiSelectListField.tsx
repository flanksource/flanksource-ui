import { useField } from "formik";
import CreatableSelect from "react-select/creatable";

type FormikMultiSelectListFieldProps = {
  name: string;
  required?: boolean;
  label?: string;
  options?: any[];
  className?: string;
};

export default function FormikMultiSelectListField({
  name,
  required = false,
  label,
  className = "flex flex-col",
  options = []
}: FormikMultiSelectListFieldProps) {
  const [field] = useField<string[]>({
    name,
    type: "text",
    required
  });

  return (
    <div className={className}>
      <label className="font-semibold">{label}</label>
      <CreatableSelect
        className="h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 sm:text-sm border-gray-300 rounded-md"
        isMulti
        options={[
          ...options.map((option) => ({ value: option, label: option }))
        ]}
        onBlur={field.onBlur}
        onChange={(value) => {
          field.onChange({
            target: {
              name: field.name,
              value: value?.map((v) => v.value)
            }
          });
        }}
        value={field.value?.map((v) => ({ value: v, label: v }))}
      />
    </div>
  );
}
