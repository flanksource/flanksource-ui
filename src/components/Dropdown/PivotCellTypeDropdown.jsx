import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { defaultCellTypeSelections } from "./lib/lists";

export function PivotCellTypeDropdown({ checks, ...rest }) {
  const items = defaultCellTypeSelections;
  return <ReactSelectDropdown {...rest} items={items} />;
}
