import clsx from "clsx";
import { ChangesTypesDropdown } from "../../ConfigChangesFilters/ChangeTypesDropdown";
import { ConfigChangeSeverity } from "../../ConfigChangesFilters/ConfigChangeSeverity";
import ConfigChangesDateRangeFilter from "../../ConfigChangesFilters/ConfigChangesDateRangeFIlter";
import { ConfigRelatedChangesToggles } from "../../ConfigChangesFilters/ConfigRelatedChangesToggles";
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
  return (
    <div className={clsx("flex flex-row gap-2", className)}>
      <ConfigTypesTristateDropdown paramsToReset={paramsToReset} />
      <ChangesTypesDropdown paramsToReset={paramsToReset} />
      <ConfigChangeSeverity paramsToReset={paramsToReset} />
      <ConfigRelatedChangesToggles />
      <ConfigChangesDateRangeFilter paramsToReset={paramsToReset} />
      <ConfigChangesToggledDeletedItems />
    </div>
  );
}
