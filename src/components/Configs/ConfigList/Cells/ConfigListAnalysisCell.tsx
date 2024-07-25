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
          <div className="flex flex-shrink flex-row items-center space-x-1 truncate">
            <span className="w-auto">
              <ConfigInsightsIcon analysis={analysis[0]} />
            </span>
            <span className="flex-1">{analysis[0].analyzer}</span>
          </div>
          {analysis.length > 1 && (
            <div className="justify-left mx-2 flex-shrink text-xs underline decoration-solid">
              +{analysis.length - 1} more
            </div>
          )}
        </div>
      }
      placement="left"
      title="Analysis"
    >
      <div className="flex w-full max-w-full flex-col space-y-2 p-3">
        {analysis.map((item, index) => (
          <div className="flex max-w-full flex-row space-x-2" key={index}>
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
