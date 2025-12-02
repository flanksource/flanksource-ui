import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { useMemo } from "react";
import { ColumnFilterOptions } from "../types";

type ViewColumnDropdownProps = {
  label: string;
  paramsKey: string;
  options?: ColumnFilterOptions;
  isLabelsColumn?: boolean;
};

export function ViewColumnDropdown({
  label,
  paramsKey,
  options,
  isLabelsColumn = false
}: ViewColumnDropdownProps) {
  const [field] = useField({
    name: paramsKey
  });

  const dropdownOptions = useMemo(() => {
    if (!options) return [];

    if (isLabelsColumn && options.labels) {
      // For labels columns, flatten the key -> values map into options
      // Format: "key____value" for filtering, display as "key: value"
      const labelOptions: TriStateOptions[] = [];
      for (const [key, values] of Object.entries(options.labels)) {
        for (const value of values) {
          labelOptions.push({
            value: `${key}____${value}`,
            label: `${key}: ${value}`,
            id: `${key}____${value}`
          });
        }
      }
      return labelOptions;
    }

    // For regular columns, use the list
    return (options.list ?? []).map((option) => ({
      value: option,
      label: option,
      id: option
    }));
  }, [options, isLabelsColumn]);

  const sortedOptions = useMemo(
    () =>
      dropdownOptions.sort((a, b) => {
        if (a.label === "All") {
          return -1;
        }
        if (b.label === "All") {
          return 1;
        }
        return String(a.label).localeCompare(String(b.label));
      }),
    [dropdownOptions]
  );

  return (
    <TristateReactSelect
      isLoading={false}
      options={sortedOptions}
      onChange={(value) => {
        if (value && value !== "all") {
          field.onChange({
            target: { name: paramsKey, value: value }
          });
        } else {
          field.onChange({
            target: { name: paramsKey, value: undefined }
          });
        }
      }}
      value={field.value}
      className="w-auto max-w-[400px]"
      label={label}
    />
  );
}
