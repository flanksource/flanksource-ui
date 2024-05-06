import clsx from "clsx";
import { ChangesTypesDropdown } from "./ChangeTypesDropdown";
import { ConfigChangeSeverity } from "./ConfigChangeSeverity";
import ConfigChangesDateRangeFilter from "./ConfigChangesDateRangeFIlter";
import ConfigTypesTristateDropdown from "./ConfigTypesTristateDropdown";

type ConfigChangeFiltersProps = React.HTMLProps<HTMLDivElement> & {
  paramsToReset?: string[];
};

export function ConfigChangeFilters({
  className,
  paramsToReset,
  ...props
}: ConfigChangeFiltersProps) {
  return (
    <div className={clsx("flex flex-row gap-2", className)} {...props}>
      <ConfigTypesTristateDropdown paramsToReset={paramsToReset} />
      <ChangesTypesDropdown paramsToReset={paramsToReset} />
      <ConfigChangeSeverity paramsToReset={paramsToReset} />
      <ConfigChangesDateRangeFilter paramsToReset={paramsToReset} />
    </div>
  );
}
