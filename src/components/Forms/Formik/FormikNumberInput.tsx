import { InputHTMLAttributes } from "react";

type CustomNumberInputProps = {
  label?: string;
  hint?: string;
  value?: number;
  onChange?: (value: number | undefined) => void;
};

type FormikNumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  CustomNumberInputProps;

export default function FormikNumberInput({
  label,
  hint,
  value,
  onChange,
  ...props
}: FormikNumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val =
      e.target.value === "" ? undefined : parseInt(e.target.value, 10);
    onChange?.(val);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="mt-1">
        <input
          type="number"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={value ?? ""}
          onChange={handleChange}
          {...props}
        />
      </div>
      {hint && <p className="mt-1 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}
