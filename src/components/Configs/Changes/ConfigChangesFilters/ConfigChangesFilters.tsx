import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import ClosableBadge from "@flanksource-ui/ui/Badge/ClosableBadge";
import clsx from "clsx";
import { useCallback, useMemo } from "react";
import { FaBan } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { paramsToReset } from "../ConfigChangeHistory";
import { ChangesTypesDropdown } from "./ChangeTypesDropdown";
import { ConfigChangeSeverity } from "./ConfigChangeSeverity";
import ConfigChangesDateRangeFilter from "./ConfigChangesDateRangeFIlter";
import ConfigTypesTristateDropdown from "./ConfigTypesTristateDropdown";

type FilterBadgeProps = {
  filters: string;
  paramKey: string;
};

function FilterBadge({ filters, paramKey }: FilterBadgeProps) {
  const [params, setParams] = useSearchParams();

  const onRemove = useCallback(
    (key: string, value: string) => {
      const currentValue = params.get(key);
      const arrayValue = currentValue?.split(",") || [];
      const newValues = arrayValue.filter(
        (v) => decodeURIComponent(v) !== decodeURIComponent(value)
      );
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
          <span className="text-gray-500 font-semibold">{paramKey}:</span>
          <span className="text-gray-500">
            {decodeURIComponent(filter.split(":")[0])}
          </span>
          <span>{filter.split(":")[1] === "-1" && <FaBan />}</span>
        </ClosableBadge>
      ))}
    </>
  );
}

type ConfigChangeFiltersProps = React.HTMLProps<HTMLDivElement> & {
  paramsToReset?: string[];
  arbitraryFilters?: Record<string, string>;
};

export function ConfigChangeFilters({
  className,
  paramsToReset = [],
  arbitraryFilters,
  ...props
}: ConfigChangeFiltersProps) {
  const [params] = useSearchParams();

  const configType = params.get("configTypes") ?? undefined;

  const defaultConfigType = useMemo(() => {
    return configType ? `${configType?.replaceAll("::", "__")}:1` : undefined;
  }, [configType]);

  return (
    <div className="flex flex-col gap-2">
      <FormikFilterForm
        paramsToReset={paramsToReset}
        filterFields={["configTypes", "changeType", "severity"]}
        defaultFieldValues={{
          ...(configType && { configTypes: defaultConfigType })
        }}
      >
        <div className={clsx("flex flex-row gap-1", className)} {...props}>
          <ConfigTypesTristateDropdown />
          <ChangesTypesDropdown />
          <ConfigChangeSeverity />
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
