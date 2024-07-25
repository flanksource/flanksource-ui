import { CellContext } from "@tanstack/react-table";
import { ConfigAnalysis } from "../../../../../api/types/configs";
import { ConfigAnalysisLink } from "../../../Insights/ConfigAnalysisLink/ConfigAnalysisLink";

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
      className="flex-1 cursor-pointer overflow-hidden"
    >
      <ConfigAnalysisLink key={insight.id} configAnalysis={insight} />
    </div>
  );
}
