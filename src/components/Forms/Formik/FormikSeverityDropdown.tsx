import { useMemo } from "react";
import Select from "react-select";
import { severityItems } from "../../Incidents/data";
import { useField } from "formik";

type FormikSeverityDropdownProps = {
  name: string;
  required?: boolean;
  label?: string;
  className?: string;
};

export default function FormikSeverityDropdown({
  name,
  required = false,
  label = "Severity",
  className = "flex flex-col gap-4 px-2"
}: FormikSeverityDropdownProps) {
  const [field] = useField<string>({
    name,
    required
  });

  const options = useMemo(() => {
    return Object.values(severityItems).map(({ name, icon }) => ({
      value: name,
      label: (
        <div className="flex pl-2 space-x-4 items-center">
          {icon} <span>{name}</span>
        </div>
      )
    }));
  }, []);

  const value = useMemo(() => {
    return options.find((option) => option.value === field.value);
  }, [field.value, options]);

  return (
    <div className={className}>
      <label className="text-sm font-semibold">{label}</label>
      <div className="flex flex-col">
        <Select
          options={options}
          value={value}
          onChange={(value) => {
            return field.onChange({ target: { value: value?.value, name } });
          }}
          name={name}
        />
      </div>
    </div>
  );
}
