import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { getLabelSelections } from "./lib/lists";

export function PivotLabelDropdown({ checks, ...rest }) {
  const items = getLabelSelections(checks);
  return <ReactSelectDropdown {...rest} items={items} />;
}
