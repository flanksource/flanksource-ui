import { useGetAllConfigTagsAndLabels } from "@flanksource-ui/api/query-hooks/useAllConfigsQuery";
import FormikSelectDropdown from "./FormikSelectDropdown";
import { useMemo } from "react";

type FormikNotificationGroupByDropdownProps = {
  name: string;
  label?: string;
  required?: boolean;
  hint?: string;
  className?: string;
};

export default function FormikNotificationGroupByDropdown({
  name,
  label = "Group By",
  required = false,
  hint
}: FormikNotificationGroupByDropdownProps) {
  const { data: tagsAndLabels, isLoading } = useGetAllConfigTagsAndLabels();

  const options = useMemo(() => {
    const dynamicOptions =
      tagsAndLabels?.map((tagLabel) => ({
        label: tagLabel.key,
        value: tagLabel.key
      })) || [];

    const staticOptions = [
      { label: "type", value: "type" },
      { label: "description", value: "description" },
      { label: "status_reason", value: "status_reason" }
    ];

    return [...staticOptions, ...dynamicOptions];
  }, [tagsAndLabels]);

  return (
    <FormikSelectDropdown
      name={name}
      className="h-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      options={options}
      label={label}
      required={required}
      hint={hint}
      isLoading={isLoading}
      isMulti
    />
  );
}
