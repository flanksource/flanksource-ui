import clsx from "clsx";
import { ConfigRelationshipDropdown } from "../../../ConfigRelationshipDropdown";
import { ChangesTypesDropdown } from "../../ConfigChangesFilters/ChangeTypesDropdown";
import { ConfigChangeSeverity } from "../../ConfigChangesFilters/ConfigChangeSeverity";
import ConfigChangesDateRangeFilter from "../../ConfigChangesFilters/ConfigChangesDateRangeFIlter";
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
      <ConfigRelationshipDropdown isConfigChanges />
      <ConfigChangesDateRangeFilter />
      <ConfigChangesToggledDeletedItems />
    </div>
  );
}
