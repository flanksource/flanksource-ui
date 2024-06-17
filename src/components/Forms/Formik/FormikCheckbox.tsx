import Hint, { HintPosition } from "@flanksource-ui/ui/FormControls/Hint";
import { useField } from "formik";

type FormikCheckboxProps = {
  name: string;
  required?: boolean;
  label?: string;
  hint?: string;
  hintPosition?: HintPosition;
  disabled?: boolean;
  labelClassName?: string;
  className?: string;
};

export default function FormikCheckbox({
  name,
  required = false,
  labelClassName = "text-sm font-semibold text-gray-700",
  className = "",
  disabled,
  hint,
  hintPosition = "bottom",
  label
}: FormikCheckboxProps) {
  const [field] = useField({
    name,
    type: "checkbox",
    required,
    disabled
  });

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex flex-row items-center space-x-1">
        <input
          id={name}
          type="checkbox"
          className="text-blue-600 bg-gray-100 border-gray-900 rounded focus:ring-blue-500 focus:ring-2"
          {...field}
          disabled={disabled}
        />
        <label htmlFor={name} className={labelClassName}>
          <div className="flex flex-col-2 ">
            {label}
            {hint && hintPosition === "tooltip" && (
              <Hint id={name} hint={hint} type="tooltip" />
            )}
          </div>
        </label>
      </div>

      {hint && hintPosition !== "tooltip" && <Hint id={name} hint={hint} />}
    </div>
  );
}
