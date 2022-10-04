import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { defaultTabSelections, getTabSelections } from "./lib/lists";

export function TabByDropdown({ checks, ...rest }) {
  const items = getTabSelections(checks, defaultTabSelections);
  return <ReactSelectDropdown {...rest} items={items} />;
}
