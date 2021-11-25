import { Dropdown } from ".";
import { getLabelSelections } from "./lib/lists";

export function PivotLabelDropdown({ checks, ...rest }) {
  const items = getLabelSelections(checks);
  return <Dropdown {...rest} items={items} />;
}
