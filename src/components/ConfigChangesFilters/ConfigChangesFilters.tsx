import clsx from "clsx";
import { ChangesTypesDropdown } from "../ChangesTypesDropdown/ChangeTypesDropdown";
import { ConfigTypesDropdown } from "../ConfigTypesDropdown";
import { ConfigChangeSeverity } from "../ConfigChangeSeverity/ConfigChangeSeverity";

type ConfigChangeFiltersProps = React.HTMLProps<HTMLDivElement>;

export function ConfigChangeFilters({
  className,
  ...props
}: ConfigChangeFiltersProps) {
  return (
    <div className={clsx("flex flex-row space-x-2", className)} {...props}>
      <ConfigTypesDropdown />
      <ChangesTypesDropdown />
      <ConfigChangeSeverity />
    </div>
  );
}
