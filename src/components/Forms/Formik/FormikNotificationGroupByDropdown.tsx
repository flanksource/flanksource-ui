import {
  useGetAllComponentLabelsKeys,
  useGetAllConfigTagsAndLabelsKeys,
  useGetAllCheckLabelsKeys
} from "@flanksource-ui/api/query-hooks/useLabelTagKeys";
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
  const { data: configTagsAndLabels, isLoading: isConfigLoading } =
    useGetAllConfigTagsAndLabelsKeys();

  const { data: componentLabels, isLoading: isComponentLoading } =
    useGetAllComponentLabelsKeys();

  const { data: checkLabels, isLoading: isCheckLoading } =
    useGetAllCheckLabelsKeys();

  const isLoading = isConfigLoading || isComponentLoading || isCheckLoading;

  const options = useMemo(() => {
    const staticOptions = [
      { label: "type", value: "type" },
      { label: "description", value: "description" },
      { label: "status_reason", value: "status_reason" }
    ];

    const dynamicOptions = [
      ...(configTagsAndLabels ?? []),
      ...(componentLabels ?? []),
      ...(checkLabels ?? [])
    ].map(({ key }) => ({ label: key, value: key }));

    const uniqueOptions = Array.from(
      new Map(
        [...staticOptions, ...dynamicOptions].map((opt) => [opt.value, opt])
      ).values()
    );

    return uniqueOptions;
  }, [configTagsAndLabels, componentLabels, checkLabels]);

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
