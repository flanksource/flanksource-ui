import clsx from "clsx";
import { ChangesTypesDropdown } from "../../../ChangesTypesDropdown/ChangeTypesDropdown";
import { ConfigTypesDropdown } from "../../ConfigsListFilters/ConfigTypesDropdown";
import { ConfigChangeSeverity } from "../ConfigChangeSeverity";
import ConfigChangesDateRangeFilter from "./ConfigChangesDateRangeFIlter";

type ConfigChangeFiltersProps = React.HTMLProps<HTMLDivElement> & {
  paramsToReset?: Record<string, string>;
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
        <ConfigTypesDropdown paramsToReset={paramsToReset} />
      )}
      <ChangesTypesDropdown paramsToReset={paramsToReset} />
      <ConfigChangeSeverity paramsToReset={paramsToReset} />
      <ConfigChangesDateRangeFilter />
    </div>
  );
}
