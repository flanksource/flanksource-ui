import clsx from "clsx";
import { ConfigTypesDropdown } from "../../ConfigsListFilters/ConfigTypesDropdown";
import { ChangesTypesDropdown } from "./ChangeTypesDropdown";
import { ConfigChangeSeverity } from "./ConfigChangeSeverity";
import ConfigChangesDateRangeFilter from "./ConfigChangesDateRangeFIlter";

type ConfigChangeFiltersProps = React.HTMLProps<HTMLDivElement> & {
  paramsToReset?: string[];
  hideConfigTypeFilter?: boolean;
};

export function ConfigChangeFilters({
  className,
  paramsToReset,
  hideConfigTypeFilter = false,
  ...props
}: ConfigChangeFiltersProps) {
  return (
    <div className={clsx("flex flex-row gap-2", className)} {...props}>
      {!hideConfigTypeFilter && (
        <ConfigTypesDropdown
          paramsToReset={paramsToReset}
          label="Config Type"
        />
      )}
      <ChangesTypesDropdown paramsToReset={paramsToReset} />
      <ConfigChangeSeverity paramsToReset={paramsToReset} />
      <ConfigChangesDateRangeFilter paramsToReset={paramsToReset} />
    </div>
  );
}
