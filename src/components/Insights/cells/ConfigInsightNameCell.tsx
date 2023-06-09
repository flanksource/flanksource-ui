import { CellContext } from "@tanstack/react-table";
import { ConfigTypeInsights } from "../../ConfigInsights";
import { ConfigAnalysisLink } from "../../ConfigAnalysisLink/ConfigAnalysisLink";

export default function ConfigInsightNameCell({
  row,
  column,
  getValue
}: CellContext<ConfigTypeInsights, unknown>) {
  const insight = row.original;
  return (
    <div
      data-html={true}
      data-tip={insight.sanitizedMessageTxt}
      data-class="max-w-[20rem]"
      className="py-2 text-black overflow-hidden cursor-pointer flex-1"
    >
      <ConfigAnalysisLink key={insight.id} configAnalysis={insight} />
    </div>
  );
}
