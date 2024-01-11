import { useMemo } from "react";
import { useComponentsQuery } from "../../../api/query-hooks";
import { Icon } from "../../Icon";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikComponentsDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  filter?: {
    type: string;
  };
};

export default function FormikComponentsDropdown({
  name,
  label,
  required = false,
  hint,
  filter
}: FormikComponentsDropdownProps) {
  const { isLoading, data: components } = useComponentsQuery({
    type: filter?.type
  });

  const options = useMemo(
    () =>
      components?.map((component) => ({
        label: component.name,
        value: component.id,
        icon: <Icon name={component.icon} />
      })),
    [components]
  );

  return (
    <FormikSelectDropdown
      name={name}
      className="h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
      options={options}
      label={label}
      isLoading={isLoading}
      required={required}
      hint={hint}
    />
  );
}
