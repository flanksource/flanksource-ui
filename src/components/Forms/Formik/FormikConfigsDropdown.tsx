import { useMemo } from "react";
import useConfigAllList from "../../../api/query-hooks/useConfigAllList";
import { ConfigIcon } from "../../../ui/Icons/ConfigIcon";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikConfigsDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  filter?: {
    types: string[];
  };
  className?: string;
};

export default function FormikConfigsDropdown({
  name,
  label,
  required = false,
  hint,
  filter,
  className = "flex flex-col space-y-2 py-2"
}: FormikConfigsDropdownProps) {
  const { isLoading, data: configs } = useConfigAllList(filter?.types ?? []);

  const options = useMemo(
    () =>
      configs?.map((config) => ({
        label: config.name,
        value: config.id,
        icon: <ConfigIcon config={config} />
      })),
    [configs]
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
