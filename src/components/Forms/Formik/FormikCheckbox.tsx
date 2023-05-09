import { useField } from "formik";

type FormikCheckboxProps = {
  name: string;
  required?: boolean;
  label?: string;
  hint?: string;
  disabled?: boolean;
  labelClassName?: string;
};

export default function FormikCheckbox({
  name,
  required = false,
  labelClassName = "text-sm font-semibold text-gray-700",
  disabled,
  hint,
  label
}: FormikCheckboxProps) {
  const [field] = useField({
    name,
    type: "checkbox",
    required,
    disabled
  });

  return (
    <div className="flex flex-row items-center space-x-2">
      <input
        id={name}
        type="checkbox"
        className="text-blue-600 bg-gray-100 border-gray-900 rounded focus:ring-blue-500 focus:ring-2"
        {...field}
        disabled={disabled}
      />
      <label htmlFor={name} className={labelClassName}>
        {label}
      </label>
      {hint && <p className="text-sm text-gray-500 py-1">{hint}</p>}
    </div>
  );
}
