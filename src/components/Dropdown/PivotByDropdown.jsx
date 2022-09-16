import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { defaultPivotSelections } from "./lib/lists";

export function PivotByDropdown({ checks, ...rest }) {
  const items = defaultPivotSelections;
  return <ReactSelectDropdown {...rest} items={items} />;
}
