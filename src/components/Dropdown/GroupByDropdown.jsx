import { Dropdown } from ".";
import { defaultGroupSelections, getLabelSelections } from "./lib/lists";

export function GroupByDropdown({ checks, ...rest }) {
  const items = getLabelSelections(checks, defaultGroupSelections);
  return <Dropdown {...rest} items={items} />;
}
