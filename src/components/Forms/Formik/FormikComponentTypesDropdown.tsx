import { useQuery } from "@tanstack/react-query";
import { useField } from "formik";
import { getComponentTypes } from "../../../api/services/topology";
import Select from "react-select";

type FormikComponentTypesDropdownProps = {
  name: string;
  required?: boolean;
  label?: string;
  className?: string;
};

export default function FormikComponentTypesDropdown({
  name,
  required = false,
  label = "Severity",
  className = "flex flex-col gap-4 px-2"
}: FormikComponentTypesDropdownProps) {
  const { data: items = [], isLoading } = useQuery(
    ["componentTypes"],
    getComponentTypes,
    {
      select: (data) =>
        data
          .filter((item) => item.type !== "")
          .map((item) => ({ value: item.type, label: item.type }))
    }
  );

  const [field] = useField<string>({
    name,
    type: "text",
    required
  });

  return (
    <div className={className}>
      <label className="text-sm font-semibold">{label}</label>
      <div className="flex flex-col">
        <Select
          options={items as any}
          value={field.value}
          onChange={(value) => field.onChange({ target: { value, name } })}
          name={name}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
