import { Dropdown } from ".";
import { defaultPivotSelections } from "./lib/lists";

export function PivotByDropdown({ checks, ...rest }) {
  const items = defaultPivotSelections;
  return <Dropdown {...rest} items={items} />;
}
