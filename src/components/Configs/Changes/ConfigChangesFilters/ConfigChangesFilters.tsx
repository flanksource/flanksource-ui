import clsx from "clsx";
import { ChangesTypesDropdown } from "../../../ChangesTypesDropdown/ChangeTypesDropdown";
import { ConfigTypesDropdown } from "../../ConfigTypesDropdown";
import { ConfigChangeSeverity } from "../ConfigChangeSeverity";

type ConfigChangeFiltersProps = React.HTMLProps<HTMLDivElement> & {
  paramsToReset?: Record<string, string>;
};

export function ConfigChangeFilters({
  className,
  paramsToReset,
  ...props
}: ConfigChangeFiltersProps) {
  return (
    <div className={clsx("flex flex-row space-x-2", className)} {...props}>
      <ConfigTypesDropdown paramsToReset={paramsToReset} />
      <ChangesTypesDropdown paramsToReset={paramsToReset} />
      <ConfigChangeSeverity paramsToReset={paramsToReset} />
    </div>
  );
}
