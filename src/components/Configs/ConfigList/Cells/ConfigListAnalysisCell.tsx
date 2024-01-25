import { CellContext } from "@tanstack/react-table";
import { ConfigItem } from "../../../../api/types/configs";
import Popover from "../../../../ui/Popover/Popover";
import ConfigInsightsIcon from "../../Insights/ConfigInsightsIcon";

export default function ConfigListAnalysisCell({
  row,
  column
}: CellContext<ConfigItem, unknown>) {
  const analysis = row?.getValue<ConfigItem["analysis"]>(column.id) || [];

  if (analysis.length === 0) {
    return null;
  }

  return (
    <Popover
      toggle={
        <div className="flex flex-row items-center">
          <div className="flex flex-row items-center flex-shrink space-x-1 truncate">
            <span className="w-auto">
              <ConfigInsightsIcon analysis={analysis[0]} />
            </span>
            <span className="flex-1">{analysis[0].analyzer}</span>
          </div>
          {analysis.length > 1 && (
            <div className="flex-shrink underline decoration-solid justify-left text-xs mx-2">
              +{analysis.length - 1} more
            </div>
          )}
        </div>
      }
      placement="left"
      title="Analysis"
    >
      <div className="flex flex-col w-full max-w-full space-y-2 p-3">
        {analysis.map((item, index) => (
          <div className="flex flex-row space-x-2 max-w-full" key={index}>
            <span className="w-auto">
              <ConfigInsightsIcon analysis={item} />
            </span>
            <span className="flex-1 overflow-hidden overflow-ellipsis">
              {item.analyzer}
            </span>
          </div>
        ))}
      </div>
    </Popover>
  );
}
