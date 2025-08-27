import { useMemo, useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ReactSelectDropdown,
  StateOption
} from "../../../../components/ReactSelectDropdown";
import { ViewFilter } from "../../types";
import { formatDisplayLabel } from "./panels/utils";

interface GlobalFiltersProps {
  filters?: ViewFilter[];
  viewId: string;
  namespace?: string;
  name?: string;
  onFilterStateChange?: (filterState: Record<string, string>) => void;
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
    return options.map(
      (option) =>
        ({
          id: option,
          value: option,
          label: option,
          description: option
        }) satisfies StateOption
    );
  }, [options]);

  return (
    <ReactSelectDropdown
      label={label}
      name={paramsKey}
      items={dropdownOptions}
      value={value}
      onChange={(selectedValue) => {
        onChange(
          paramsKey,
          selectedValue && selectedValue !== "all" ? selectedValue : undefined
        );
      }}
      placeholder="Select..."
      dropDownClassNames="w-auto max-w-[400px]"
      isMulti={false}
    />
  );
};

const GlobalFilters: React.FC<GlobalFiltersProps> = ({
  filters,
  viewId,
  namespace,
  name,
  onFilterStateChange
}) => {
  const queryClient = useQueryClient();

  // Initialize filter state with defaults
  const [filterState, setFilterState] = useState<Record<string, string>>({});
  const [hasInitialized, setHasInitialized] = useState(false);

  // Update filter state when filters prop changes (e.g., when view data loads)
  // But only initialize once, don't reset user selections
  useEffect(() => {
    if (filters && filters.length > 0 && !hasInitialized) {
      const initial: Record<string, string> = {};
      filters.forEach((filter) => {
        // Use default value if provided, otherwise use first option
        const defaultValue =
          filter.default ||
          (filter.options.length > 0 ? filter.options[0] : "");
        if (defaultValue) {
          initial[filter.key] = defaultValue;
        }
      });

      setFilterState(initial);
      setHasInitialized(true);
      console.log("Setting initial filter state:", initial);
      onFilterStateChange?.(initial);
    }
  }, [filters, hasInitialized, onFilterStateChange]);

  const handleFilterChange = useCallback(
    (key: string, value?: string) => {
      const newFilterState = { ...filterState };
      if (value) {
        newFilterState[key] = value;
      } else {
        delete newFilterState[key];
      }

      setFilterState(newFilterState);
      console.log("Filter changed, new state:", newFilterState);
      onFilterStateChange?.(newFilterState);

      // Invalidate table queries to refresh table data
      if (namespace && name) {
        queryClient.invalidateQueries({
          queryKey: ["view-table", namespace, name]
        });
      }
    },
    [filterState, namespace, name, queryClient, onFilterStateChange]
  );

  const filterComponents = useMemo(() => {
    if (!filters || filters.length === 0) return [];

    return filters.map((filter) => (
      <GlobalFilterDropdown
        key={filter.key}
        label={filter.label || formatDisplayLabel(filter.key)}
        paramsKey={filter.key}
        options={filter.options}
        value={filterState[filter.key]}
        onChange={handleFilterChange}
      />
    ));
  }, [filters, filterState, handleFilterChange]);

  if (!filters || filters.length === 0) {
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
