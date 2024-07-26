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
  assertAsString?: boolean;
};

export default function FormikCheckbox({
  name,
  required = false,
  labelClassName = "text-sm font-semibold text-gray-700",
  className = "",
  disabled,
  hint,
  hintPosition = "bottom",
  label,
  assertAsString = false
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
          className="rounded border-gray-900 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
          {...field}
          checked={assertAsString ? field.value === "true" : field.value}
          onChange={(e) => {
            field.onChange({
              target: {
                name: e.target.name,
                value: assertAsString
                  ? e.target.checked.valueOf().toString()
                  : e.target.checked
              }
            });
          }}
          disabled={disabled}
        />
        <label htmlFor={name} className={labelClassName}>
          <div className="flex-col-2 flex">
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
