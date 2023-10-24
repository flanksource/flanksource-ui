import { CellContext } from "@tanstack/react-table";
import { ConfigTypeInsights } from "../../ConfigInsights";
import { Age } from "../../UI/Age";

export default function ConfigInsightAgeCell({
  row,
  column,
  getValue
}: CellContext<
  Pick<
    ConfigTypeInsights,
    | "id"
    | "analyzer"
    | "config"
    | "severity"
    | "analysis_type"
    | "sanitizedMessageTxt"
    | "sanitizedMessageHTML"
    | "first_observed"
  >,
  unknown
>) {
  return (
    <Age className="flex py-1 text-sm" from={row.original.first_observed} />
  );
}
