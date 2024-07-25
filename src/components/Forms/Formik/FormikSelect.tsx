import clsx from "clsx";
import { useField } from "formik";

type FormikSelectProps = React.HTMLProps<HTMLSelectElement> & {
  name: string;
  required?: boolean;
  label?: string;
};

export default function FormikSelect({
  name,
  required = false,
  label,
  children,
  ...props
}: FormikSelectProps) {
  const [field] = useField({
    name,
    type: "checkbox",
    required
  });

  return (
    <div className="flex flex-row items-center space-x-2">
      <label htmlFor={name} className="text-sm font-bold text-gray-700">
        {label}
      </label>
      <select
        id={name}
        className={clsx(
          "inline-block flex-1 rounded-md border-gray-300 py-2 pl-3 pr-10 shadow-sm"
        )}
        {...props}
        {...field}
      >
        {children}
      </select>
    </div>
  );
}
