import React from "react";
import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import { ConfigChangeSeverity } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangeSeverity";
import { ChangesTypesDropdown } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ChangeTypesDropdown";
import { ConfigTagsDropdown } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigTagsDropdown";
import ConfigTypesTristateDropdown from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigTypesTristateDropdown";
import ConfigChangesDateRangeFilter from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesDateRangeFIlter";
import ClosableBadge from "@flanksource-ui/ui/Badge/ClosableBadge";
import { useConfigChangesArbitraryFilters } from "@flanksource-ui/hooks/useConfigChangesArbitraryFilters";
import { usePrefixedSearchParams } from "@flanksource-ui/hooks/usePrefixedSearchParams";
import { FaBan } from "react-icons/fa";
import { useCallback } from "react";
import { paramsToReset } from "@flanksource-ui/components/Configs/Changes/ConfigChangeTable";
import clsx from "clsx";

interface FilterBadgeProps {
  filters: string;
  paramKey: string;
  paramPrefix?: string;
}

function FilterBadge({ filters, paramKey, paramPrefix }: FilterBadgeProps) {
  const [, setParams] = usePrefixedSearchParams(paramPrefix, false);

  const onRemove = useCallback(
    (key: string, value: string) => {
      setParams((currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        const currentValue = nextParams.get(key);
        const arrayValue = currentValue?.split(",") || [];
        const newValues = arrayValue.filter((v) => v !== value);
        if (newValues.length === 0) {
          nextParams.delete(key);
        } else {
          const updateValue = newValues.join(",");
          nextParams.set(key, updateValue);
        }
        paramsToReset.configChanges.forEach((param) =>
          nextParams.delete(param)
        );
        return nextParams;
      });
    },
    [setParams]
  );

  const filtersArray = filters.split(",");

  return (
    <>
      {filtersArray.map((filter) => (
        <ClosableBadge
          color="gray"
          key={filter}
          className="flex flex-row gap-1 px-2 text-xs"
          onRemove={() => onRemove(paramKey, filter)}
        >
          <span className="font-semibold text-gray-500">
            {paramKey === "external_created_by" ? "created_by" : paramKey}:
          </span>
          <span className="text-gray-500">
            {filter
              .split(":")[0]
              .replaceAll("____", ":")
              .replaceAll("||||", ",")}
          </span>
          <span>{filter.split(":")[1] === "-1" && <FaBan />}</span>
        </ClosableBadge>
      ))}
    </>
  );
}

interface ChangesUIFiltersProps extends React.HTMLProps<HTMLDivElement> {
  paramsToReset?: string[];
  paramPrefix?: string;
}

/**
 * ChangesUIFilters - Filter component for Changes UI.
 *
 * Preset filters are seeded into URL params by ChangesUISection before this
 * form is rendered.
 */
export function ChangesUIFilters({
  paramsToReset = [],
  paramPrefix,
  className,
  ...props
}: ChangesUIFiltersProps) {
  const arbitraryFilters = useConfigChangesArbitraryFilters(paramPrefix);

  return (
    <div className="flex w-full flex-col gap-2">
      <FormikFilterForm
        paramsToReset={[...paramsToReset, "configType"]}
        filterFields={["configTypes", "changeType", "severity", "tags"]}
        paramPrefix={paramPrefix}
      >
        <div className={clsx("flex flex-wrap gap-1", className)} {...props}>
          <ConfigTypesTristateDropdown />
          <ChangesTypesDropdown />
          <ConfigChangeSeverity />
          <ConfigTagsDropdown />
          <ConfigChangesDateRangeFilter
            paramsToReset={paramsToReset}
            paramPrefix={paramPrefix}
          />
        </div>
      </FormikFilterForm>
      <div className="flex flex-wrap gap-2">
        {Object.entries(arbitraryFilters ?? {}).map(([key, value]) => (
          <FilterBadge
            filters={value}
            key={`${key}-${value}`}
            paramKey={key}
            paramPrefix={paramPrefix}
          />
        ))}
      </div>
    </div>
  );
}
