import { ConfigChange } from "@flanksource-ui/api/types/configs";
import FilterByCellValue from "@flanksource-ui/ui/DataTable/FilterByCellValue";
import { Age } from "@flanksource-ui/ui/Age";
import { ChangeIcon } from "@flanksource-ui/ui/Icons/ChangeIcon";
import { Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import { paramsToReset } from "./ConfigChangeTable";
import { GroupedChange } from "./ConfigChangesSwimlaneUtils";

function ChangeRow({
  change,
  onExpand,
  showType = true
}: {
  change: ConfigChange;
  onExpand?: () => void;
  showType?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 text-xs">
      <div className="flex items-center gap-2">
        {showType && (
          <FilterByCellValue
            filterValue={change.change_type}
            paramKey="changeType"
            paramsToReset={paramsToReset.configChanges}
          >
            <span className="flex shrink-0 items-center gap-1 font-medium">
              <ChangeIcon change={change} className="h-4 w-4" />
              {change.change_type}
            </span>
          </FilterByCellValue>
        )}
        {showType && <span className="h-3 w-px shrink-0 bg-gray-300" />}
        <span className="shrink-0 whitespace-nowrap text-gray-500">
          <Age from={change.first_observed} />
          {(change.count || 1) > 1 && (
            <span className="pl-1">(x{change.count})</span>
          )}
        </span>
        {onExpand && (
          <>
            <span className="flex-1" />
            <button
              className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
              title="View full details"
            >
              <Maximize2 className="h-3 w-3" />
            </button>
          </>
        )}
      </div>

      {change.summary && (
        <div className="flex items-start gap-1.5">
          <span className="shrink-0 text-gray-400">Summary</span>
          <FilterByCellValue
            filterValue={change.summary}
            paramKey="summary"
            paramsToReset={paramsToReset.configChanges}
          >
            <span className="text-gray-600">{change.summary}</span>
          </FilterByCellValue>
        </div>
      )}

      {(change.created_by || change.external_created_by) && (
        <div className="flex items-center gap-1.5">
          <span className="shrink-0 text-gray-400">By</span>
          <FilterByCellValue
            filterValue={change.created_by || change.external_created_by || ""}
            paramKey={change.created_by ? "created_by" : "external_created_by"}
            paramsToReset={paramsToReset.configChanges}
          >
            <span className="text-gray-600">
              {change.created_by || change.external_created_by}
            </span>
          </FilterByCellValue>
        </div>
      )}
    </div>
  );
}

export function SwimlaneTooltip({
  change,
  onExpand
}: {
  change: ConfigChange;
  onExpand?: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-gray-100 p-2 text-black shadow-sm">
      <ChangeRow change={change} onExpand={onExpand} />
    </div>
  );
}

export function GroupedSwimlaneTooltip({
  group,
  onExpand
}: {
  group: GroupedChange;
  onExpand?: (change: ConfigChange) => void;
}) {
  const { count, changes } = group;
  const allSameConfig = changes.every(
    (c) => c.config_id === changes[0]?.config_id
  );
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-gray-100 p-2 text-black shadow-sm">
      <div className="flex flex-col gap-2 divide-y divide-gray-300">
        {changes.slice(0, 5).map((change, i) => (
          <div
            key={change.id}
            className="flex flex-col gap-1 pt-1.5 first:pt-0"
          >
            {!allSameConfig && (
              <Link
                to={`/catalog/${change.config?.id}`}
                className="flex items-center gap-1 text-xs hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <ConfigsTypeIcon config={change.config}>
                  <span className="truncate">{change.config?.name}</span>
                </ConfigsTypeIcon>
              </Link>
            )}
            <ChangeRow
              change={change}
              onExpand={onExpand ? () => onExpand(change) : undefined}
              showType={i === 0}
            />
          </div>
        ))}
      </div>
      {count > 5 && (
        <span className="border-t border-gray-300 pt-1 text-xs text-gray-500">
          +{count - 5} more
        </span>
      )}
    </div>
  );
}
