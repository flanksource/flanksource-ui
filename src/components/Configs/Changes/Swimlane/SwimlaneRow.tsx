import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { useMemo } from "react";
import ConfigsTypeIcon from "../../ConfigsTypeIcon";
import { BucketedRow } from "./Utils";
import { BucketCells } from "./BucketCells";
import { ResizeHandle } from "./ResizeHandle";
import { SeverityBadges } from "./SeverityBadges";

export function SwimlaneRow({
  row,
  columnWidth,
  numBuckets,
  onItemClicked,
  onResizeMouseDown,
  timelineOffsetWidth = 0,
  min,
  max,
  indentLevel = 0,
  even = false
}: {
  row: BucketedRow;
  columnWidth: number;
  numBuckets: number;
  onItemClicked: (change: ConfigChange) => void;
  onResizeMouseDown: (e: React.MouseEvent) => void;
  timelineOffsetWidth?: number;
  min: number;
  max: number;
  indentLevel?: number;
  even?: boolean;
}) {
  const bg = even ? "bg-gray-50/40" : "bg-white";
  const allChanges = useMemo(() => row.buckets.flat(), [row.buckets]);

  return (
    <div
      className={`relative z-0 flex flex-row border-b border-gray-100 hover:z-50 hover:bg-gray-100/50 ${bg}`}
      style={{ minHeight: "36px" }}
    >
      <div
        className={`sticky left-0 z-20 flex shrink-0 items-center gap-3 overflow-visible px-2 py-1 text-sm shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] ${bg}`}
        style={{ width: columnWidth }}
      >
        {/* config name and link */}
        <div
          className="relative z-30 min-w-0 flex-1"
          style={{ paddingLeft: indentLevel * 24 }}
        >
          <ConfigsTypeIcon config={row.config}>
            <span className="truncate">{row.name}</span>
          </ConfigsTypeIcon>
        </div>

        <span className="h-4 w-px shrink-0 bg-gray-200" />

        <SeverityBadges
          severity={row.severity}
          changes={allChanges}
          onExpand={onItemClicked}
        />

        <ResizeHandle onMouseDown={onResizeMouseDown} />
      </div>

      <div
        className="flex flex-1 flex-row items-stretch border-l border-gray-200"
        style={{ paddingLeft: timelineOffsetWidth }}
      >
        {row.preRangeBadge && (
          <span className="flex items-center px-1 text-[10px] text-gray-400">
            {row.preRangeBadge}
          </span>
        )}
        <BucketCells
          buckets={row.buckets}
          numBuckets={numBuckets}
          onItemClicked={onItemClicked}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
}
