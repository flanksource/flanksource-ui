import { useField } from "formik";
import { Switch } from "../../Switch";

type Props = {
  name: string;
  label?: string;
  hint?: string;
  className?: string;
  required?: boolean;
  options: {
    label: string;
    key: string;
  }[];
};

export default function FormikSwitchField({
  name,
  label,
  hint,
  className = "flex flex-col gap-2",
  required = false,
  options
}: Props) {
  const [field, meta] = useField<string>({
    name,
    required
  });

  return (
    <div className={className}>
      <label htmlFor={name} className="text-sm font-bold text-gray-700">
        {label}
      </label>
      <div className="flex flex-row items-center">
        <Switch
          options={options.map((x) => x.label)}
          value={options.find((x) => x.key === field.value)?.label}
          onChange={(value) => {
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
      {hint && <p className="text-sm text-gray-500 py-1">{hint}</p>}
      {meta.touched && meta.error ? (
        <p className="text-sm text-red-500 w-full py-1">{meta.error}</p>
      ) : null}
    </div>
  );
}
