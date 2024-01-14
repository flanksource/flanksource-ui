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
  className?: string;
};

export default function FormikComponentsDropdown({
  name,
  label,
  required = false,
  hint,
  filter,
  className = "flex flex-col space-y-2 py-2"
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
      className={className}
      options={options}
      label={label}
      isLoading={isLoading}
      required={required}
      hint={hint}
    />
  );
}
