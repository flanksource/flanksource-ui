import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import ClosableBadge from "@flanksource-ui/ui/Badge/ClosableBadge";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { FaBan } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { useConfigChangesArbitraryFilters } from "../../../../hooks/useConfigChangesArbitraryFilters";
import { paramsToReset } from "../ConfigChangeTable";
import { ChangesTypesDropdown } from "./ChangeTypesDropdown";
import { ConfigChangeSeverity } from "./ConfigChangeSeverity";
import ConfigChangesDateRangeFilter from "./ConfigChangesDateRangeFIlter";
import { ConfigTagsDropdown } from "./ConfigTagsDropdown";
import ConfigTypesTristateDropdown from "./ConfigTypesTristateDropdown";

type FilterBadgeProps = {
  filters: string;
  paramKey: string;
};

export function FilterBadge({ filters, paramKey }: FilterBadgeProps) {
  const [params, setParams] = useSearchParams();

  const onRemove = useCallback(
    (key: string, value: string) => {
      const currentValue = params.get(key);
      const arrayValue = currentValue?.split(",") || [];
      const newValues = arrayValue.filter((v) => v !== value);
      if (newValues.length === 0) {
        params.delete(key);
      } else {
        const updateValue = newValues.join(",");
        params.set(key, updateValue);
      }
      paramsToReset.configChanges.forEach((param) => params.delete(param));
      setParams(params);
    },
    [params, setParams]
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

type ConfigChangeFiltersProps = React.HTMLProps<HTMLDivElement> & {
  paramsToReset?: string[];
};

export function ConfigChangeFilters({
  className,
  paramsToReset = [],
  ...props
}: ConfigChangeFiltersProps) {
  const [params] = useSearchParams();

  const arbitraryFilters = useConfigChangesArbitraryFilters();

  const configType = params.get("configTypes") ?? undefined;

  const defaultConfigType = useMemo(() => {
    return configType ? `${configType?.replaceAll("::", "__")}:1` : undefined;
  }, [configType]);

  return (
    <div className="flex w-full flex-col gap-2">
      <FormikFilterForm
        paramsToReset={paramsToReset}
        filterFields={["configTypes", "changeType", "severity", "tags"]}
        defaultFieldValues={{
          ...(configType && { configTypes: defaultConfigType })
        }}
      >
        <div className={clsx("flex flex-wrap gap-1", className)} {...props}>
          <ConfigTypesTristateDropdown />
          <ChangesTypesDropdown />
          <ConfigChangeSeverity />
          <ConfigTagsDropdown />
          <ConfigChangesDateRangeFilter paramsToReset={paramsToReset} />
        </div>
      </FormikFilterForm>
      <div className="flex flex-wrap gap-2">
        {Object.entries(arbitraryFilters ?? {}).map(([key, value]) => (
          <FilterBadge filters={value} key={value} paramKey={key} />
        ))}
      </div>
    </div>
  );
}
