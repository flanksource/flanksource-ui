import { ComponentProps } from "react";
import { ReactSelectDropdown } from "../ReactSelectDropdown";
import { defaultTabSelections, getTabSelections } from "./lib/lists";

export function TabByDropdown({
  checks,
  ...rest
}: ComponentProps<typeof ReactSelectDropdown> & {
  checks?: any[];
}) {
  const items = getTabSelections(checks, defaultTabSelections);
  return <ReactSelectDropdown {...rest} items={items} />;
}
