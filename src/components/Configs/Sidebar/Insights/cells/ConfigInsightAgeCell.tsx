import { CellContext } from "@tanstack/react-table";
import { ConfigAnalysis } from "../../../../../api/types/configs";
import { Age } from "../../../../../ui/Age";

export default function ConfigInsightAgeCell({
  row,
  column,
  getValue
}: CellContext<
  Pick<
    ConfigAnalysis,
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
  return <Age className="flex py-1" from={row.original.first_observed} />;
}
