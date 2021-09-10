import { Dropdown } from ".";
import { getGroupSelections, defaultGroupSelections } from "../Canary/grouping";

export function GroupByDropdown({ checks, ...rest }) {
  const items = getGroupSelections(checks, defaultGroupSelections);
  return <Dropdown {...rest} items={items} />;
}
