import { useMemo, useCallback } from "react";
import {
  GroupByOptions,
  MultiSelectDropdown
} from "../../../../ui/Dropdowns/MultiSelectDropdown";
import { ViewVariable } from "../../types";
import { formatDisplayLabel } from "./panels/utils";

interface GlobalFiltersProps {
  variables?: ViewVariable[];
  current?: Record<string, string>;
  onChange?: (filterState: Record<string, string>) => void;
}

interface GlobalFilterDropdownProps {
  label: string;
  paramsKey: string;
  options: string[];
  value?: string;
  onChange: (key: string, value?: string) => void;
}

const GlobalFilterDropdown: React.FC<GlobalFilterDropdownProps> = ({
  label,
  paramsKey,
  options,
  value,
  onChange
}) => {
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

  const selectedValue = useMemo(() => {
    if (!value) {
      return { value: "all", label: "All" };
    }
    return (
      dropdownOptions.find((option) => option.value === value) || {
        value: "all",
        label: "All"
      }
    );
  }, [value, dropdownOptions]);

  return (
    <MultiSelectDropdown
      label={label}
      options={dropdownOptions}
      value={selectedValue}
      onChange={(selectedOption: unknown) => {
        const option = selectedOption as GroupByOptions;
        onChange(
          paramsKey,
          option && option.value !== "all" ? option.value : undefined
        );
      }}
      className="w-auto max-w-[400px]"
      isMulti={false}
      closeMenuOnSelect={true}
      isClearable={false}
    />
  );
};

const GlobalFilters: React.FC<GlobalFiltersProps> = ({
  variables,
  current = {},
  onChange
}) => {
  const handleFilterChange = useCallback(
    (key: string, value?: string) => {
      const newFilterState = { ...current };
      if (value) {
        newFilterState[key] = value;
      } else {
        delete newFilterState[key];
      }

      onChange?.(newFilterState);
    },
    [current, onChange]
  );

  const filterComponents = useMemo(() => {
    if (!variables || variables.length === 0) return [];

    return variables.map((variable) => (
      <GlobalFilterDropdown
        key={variable.key}
        label={variable.label || formatDisplayLabel(variable.key)}
        paramsKey={variable.key}
        options={variable.options}
        value={current[variable.key]}
        onChange={handleFilterChange}
      />
    ));
  }, [variables, current, handleFilterChange]);

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
