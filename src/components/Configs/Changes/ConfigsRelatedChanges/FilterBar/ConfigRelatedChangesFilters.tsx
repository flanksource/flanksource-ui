import clsx from "clsx";
import { ConfigRelationshipDropdown } from "../../../ConfigRelationshipDropdown";
import { ConfigChangeSeverity } from "../../ConfigChangeSeverity";
import { ChangesTypesDropdown } from "../../ConfigChangesFilters/ChangeTypesDropdown";
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
