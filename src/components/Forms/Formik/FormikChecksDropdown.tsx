import { getCheckNames } from "@flanksource-ui/api/services/topology";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Icon } from "../../../ui/Icons/Icon";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikChecksDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  filter?: {
    types: string[];
  };
  className?: string;
};

export default function FormikChecksDropdown({
  name,
  label,
  required = false,
  hint,
  filter,
  className = "flex flex-col space-y-2 py-2"
}: FormikChecksDropdownProps) {
  const { isLoading, data: checks } = useQuery({
    queryKey: ["checks", "check_names"],
    queryFn: () => getCheckNames()
  });

  const options = useMemo(
    () =>
      checks?.map((check) => ({
        label: check.name,
        value: check.id,
        icon: <Icon name={check.type} className="h-5 w-5" />
      })),
    [checks]
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
