import Hint, { HintPosition } from "@flanksource-ui/ui/FormControls/Hint";
import { Switch } from "@headlessui/react";
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
  checkboxStyle?: "check" | "toggle";
  inline?: boolean;
};

export default function FormikCheckbox({
  name,
  required = false,
  labelClassName = "form-label",
  className = "",
  disabled,
  hint,
  hintPosition = "bottom",
  checkboxStyle = "check",
  label,
  assertAsString = false,
  inline = false
}: FormikCheckboxProps) {
  const [field] = useField({
    name,
    type: "checkbox",
    required,
    disabled
  });

  if (inline) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {checkboxStyle === "check" && (
          <input
            id={name}
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
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
        )}

        {checkboxStyle === "toggle" && (
          <Switch
            id={name}
            {...field}
            checked={assertAsString ? field.value === "true" : field.value}
            onChange={(checked) => {
              field.onChange({
                target: {
                  name: field.name,
                  value: assertAsString ? checked.valueOf().toString() : checked
                }
              });
            }}
            disabled={disabled}
            className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-offset-2 data-[checked]:bg-blue-600"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
            />
          </Switch>
        )}

        <label htmlFor={name} className={labelClassName}>
          <div className="flex items-center gap-1">
            {label}
            {hint && hintPosition === "tooltip" && (
              <Hint id={name} hint={hint} type="tooltip" />
            )}
          </div>
        </label>

        {hint && hintPosition !== "tooltip" && <Hint id={name} hint={hint} />}
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="items-center">
        <label htmlFor={name} className={labelClassName}>
          <div className="flex-col-2 flex">
            {label}
            {hint && hintPosition === "tooltip" && (
              <Hint id={name} hint={hint} type="tooltip" />
            )}
          </div>
        </label>
        {checkboxStyle === "check" && (
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
        )}

        {checkboxStyle === "toggle" && (
          <Switch
            id={name}
            {...field}
            checked={assertAsString ? field.value === "true" : field.value}
            onChange={(checked) => {
              field.onChange({
                target: {
                  name: field.name,
                  value: assertAsString ? checked.valueOf().toString() : checked
                }
              });
            }}
            disabled={disabled}
            className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-offset-2 data-[checked]:bg-blue-600"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
            />
          </Switch>
        )}
      </div>

      {hint && hintPosition !== "tooltip" && <Hint id={name} hint={hint} />}
    </div>
  );
}
