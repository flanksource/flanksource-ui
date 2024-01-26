import { CellContext } from "@tanstack/react-table";
import { ConfigAnalysisLink } from "../../Configs/Insights/ConfigAnalysisLink/ConfigAnalysisLink";
import { ConfigAnalysis } from "../../../api/types/configs";

export default function ConfigInsightNameCell({
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
  const insight = row.original;
  return (
    <div
      data-html={true}
      data-class="max-w-[20rem]"
      className="overflow-hidden cursor-pointer flex-1"
    >
      <ConfigAnalysisLink key={insight.id} configAnalysis={insight} />
    </div>
  );
}
