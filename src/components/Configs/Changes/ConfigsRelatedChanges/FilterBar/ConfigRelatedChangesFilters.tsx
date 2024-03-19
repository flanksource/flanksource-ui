import clsx from "clsx";
import { ChangesTypesDropdown } from "../../ConfigChangesFilters/ChangeTypesDropdown";
import { ConfigChangeSeverity } from "../../ConfigChangesFilters/ConfigChangeSeverity";
import ConfigChangesDateRangeFilter from "../../ConfigChangesFilters/ConfigChangesDateRangeFIlter";
import { ConfigRelatedChangesToggles } from "../../ConfigChangesFilters/ConfigRelatedChangesToggles";
import { ConfigChangesToggledDeletedItems } from "./ConfigChangesToggledDeletedItems";

type ConfigChangeFiltersProps = {
  className?: string;
};

export function ConfigRelatedChangesFilters({
  className
}: ConfigChangeFiltersProps) {
  return (
    <div className={clsx("flex flex-row gap-2", className)}>
      <ChangesTypesDropdown />
      <ConfigChangeSeverity />
      <ConfigRelatedChangesToggles />
      <ConfigChangesDateRangeFilter />
      <ConfigChangesToggledDeletedItems />
    </div>
  );
}
