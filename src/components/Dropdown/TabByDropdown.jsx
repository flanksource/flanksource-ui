import { Dropdown } from ".";
import { defaultTabSelections, getTabSelections } from "./lib/lists";

export function TabByDropdown({ checks, ...rest }) {
  const items = getTabSelections(checks, defaultTabSelections);
  return <Dropdown {...rest} items={items} />;
}
