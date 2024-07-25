import FormikFilterForm from "@flanksource-ui/components/Forms/FormikFilterForm";
import clsx from "clsx";
import { useConfigChangesArbitraryFilters } from "../../../../../hooks/useConfigChangesArbitraryFilters";
import { ChangesTypesDropdown } from "../../ConfigChangesFilters/ChangeTypesDropdown";
import { ConfigChangeSeverity } from "../../ConfigChangesFilters/ConfigChangeSeverity";
import ConfigChangesDateRangeFilter from "../../ConfigChangesFilters/ConfigChangesDateRangeFIlter";
import { FilterBadge } from "../../ConfigChangesFilters/ConfigChangesFilters";
import { ConfigRelatedChangesToggles } from "../../ConfigChangesFilters/ConfigRelatedChangesToggles";
import { ConfigTagsDropdown } from "../../ConfigChangesFilters/ConfigTagsDropdown";
import ConfigTypesTristateDropdown from "../../ConfigChangesFilters/ConfigTypesTristateDropdown";
import { ConfigChangesToggledDeletedItems } from "./ConfigChangesToggledDeletedItems";

type ConfigChangeFiltersProps = {
  className?: string;
  paramsToReset?: string[];
};

export function ConfigRelatedChangesFilters({
  className,
  paramsToReset = []
}: ConfigChangeFiltersProps) {
  const arbitraryFilters = useConfigChangesArbitraryFilters();

  return (
    <div className="flex flex-col gap-2">
      <FormikFilterForm
        paramsToReset={paramsToReset}
        filterFields={["configTypes", "changeType", "severity", "tags"]}
      >
        <div className={clsx("flex flex-wrap items-center gap-2", className)}>
          <ConfigTypesTristateDropdown />
          <ChangesTypesDropdown />
          <ConfigChangeSeverity />
          <ConfigTagsDropdown />
          <ConfigRelatedChangesToggles />
          <ConfigChangesDateRangeFilter paramsToReset={paramsToReset} />
          <ConfigChangesToggledDeletedItems />
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
