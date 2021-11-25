import { Dropdown } from ".";
import { defaultCellTypeSelections } from "./lib/lists";

export function PivotCellTypeDropdown({ checks, ...rest }) {
  const items = defaultCellTypeSelections;
  return <Dropdown {...rest} items={items} />;
}
