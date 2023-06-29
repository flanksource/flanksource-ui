import { CellContext } from "@tanstack/react-table";
import { relativeDateTime } from "../../../utils/date";
import { ConfigTypeInsights } from "../../ConfigInsights";

export default function ConfigInsightAgeCell({
  row,
  column,
  getValue
}: CellContext<ConfigTypeInsights, unknown>) {
  const age = relativeDateTime(row.original.first_observed);
  return <span className="flex flex-nowrap py-1 text-sm">{age}</span>;
}
