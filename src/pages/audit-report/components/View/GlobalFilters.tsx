import { useMemo } from "react";
import {
  GroupByOptions,
  MultiSelectDropdown
} from "../../../../ui/Dropdowns/MultiSelectDropdown";
import { ViewVariable } from "../../types";
import { formatDisplayLabel } from "./panels/utils";
import { useField } from "formik";

interface DropdownProps {
  label: string;
  paramsKey: string;
  options: string[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, paramsKey, options }) => {
  const [field] = useField({
    name: paramsKey
  });
  const dropdownOptions = useMemo(() => {
    const mappedOptions = options.map(
      (option) =>
        ({
          value: option,
          label: option
        }) satisfies GroupByOptions
    );

    return mappedOptions;
  }, [options]);

  return (
    <MultiSelectDropdown
      label={label}
      options={dropdownOptions}
      value={dropdownOptions.find((option) => option.value === field.value)}
      onChange={(selectedOption: unknown) => {
        const option = selectedOption as GroupByOptions;
        field.onChange({
          target: { name: paramsKey, value: option?.value }
        });
      }}
      className="w-auto max-w-[400px]"
      isMulti={false}
      closeMenuOnSelect={true}
      isClearable={false}
    />
  );
};

interface GlobalFiltersProps {
  variables?: ViewVariable[];
}

const GlobalFilters: React.FC<GlobalFiltersProps> = ({ variables }) => {
  const filterComponents = useMemo(() => {
    if (!variables || variables.length === 0) return [];

    return variables.map((variable) => (
      <Dropdown
        key={variable.key}
        label={variable.label || formatDisplayLabel(variable.key)}
        paramsKey={variable.key}
        options={variable.options}
      />
    ));
  }, [variables]);

  if (!variables || variables.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {filterComponents}
      </div>
    </div>
  );
};

export default GlobalFilters;
