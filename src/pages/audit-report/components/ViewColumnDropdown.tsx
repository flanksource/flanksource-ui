import TristateReactSelect, {
  TriStateOptions
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { useField } from "formik";
import { useMemo } from "react";

type ViewColumnDropdownProps = {
  label: string;
  paramsKey: string;
  options: string[];
};

export function ViewColumnDropdown({
  label,
  paramsKey,
  options
}: ViewColumnDropdownProps) {
  const [field] = useField({
    name: paramsKey
  });

  const dropdownOptions = useMemo(() => {
    return options.map(
      (option) =>
        ({
          value: option,
          label: option,
          id: option
        }) satisfies TriStateOptions
    );
  }, [options]);

  const sortedOptions = useMemo(
    () =>
      dropdownOptions.sort((a, b) => {
        if (a.label === "All") {
          return -1;
        }
        if (b.label === "All") {
          return 1;
        }
        return a.label?.localeCompare(b.label);
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
