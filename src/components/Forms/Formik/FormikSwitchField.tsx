import { useField } from "formik";
import { Switch } from "../../../ui/FormControls/Switch";

type Props<OptionsValueType = string> = {
  name: string;
  label?: React.ReactNode;
  hintPosition?: "top" | "bottom";
  hint?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  options: {
    label: string;
    key: OptionsValueType;
  }[];
};

export default function FormikSwitchField<OptionsValueType = string>({
  name,
  label,
  hint,
  hintPosition = "bottom",
  className = "flex flex-col gap-2",
  required = false,
  disabled = false,
  options
}: Props<OptionsValueType>) {
  const [field, meta] = useField<string>({
    name,
    required
  });

  return (
    <div className={className}>
      <label htmlFor={name} className="text-sm font-bold text-gray-700">
        {label}
      </label>
      {hint && hintPosition === "top" && (
        <p className="py-1 text-sm text-gray-500">{hint}</p>
      )}
      <div className={disabled ? "pointer-events-none opacity-60" : ""}>
        <Switch
          options={options.map((x) => x.label)}
          value={options.find((x) => x.key === field.value)?.label}
          onChange={(value) => {
            if (disabled) return;
            const realValue = options.find((x) => x.label === value);
            if (realValue) {
              field.onChange({
                target: {
                  value: realValue.key,
                  name: field.name
                }
              });
            }
          }}
        />
      </div>
      {hint && hintPosition === "bottom" && (
        <p className="py-1 text-sm text-gray-500">{hint}</p>
      )}
      {meta.touched && meta.error ? (
        <p className="w-full py-1 text-sm text-red-500">{meta.error}</p>
      ) : null}
    </div>
  );
}
