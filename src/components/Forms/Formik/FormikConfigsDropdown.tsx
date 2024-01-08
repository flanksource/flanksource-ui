import { useMemo } from "react";
import useConfigAllList from "../../../api/query-hooks/useConfigAllList";
import { ConfigIcon } from "../../Icon/ConfigIcon";
import FormikSelectDropdown from "./FormikSelectDropdown";

type FormikConfigsDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  filter?: {
    type: string;
  };
};

export default function FormikConfigsDropdown({
  name,
  label,
  required = false,
  hint,
  filter
}: FormikConfigsDropdownProps) {
  const { isLoading, data: configs } = useConfigAllList(filter?.type);

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
      className="h-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
      options={options}
      label={label}
      isLoading={isLoading}
      required={required}
      hint={hint}
    />
  );
}
