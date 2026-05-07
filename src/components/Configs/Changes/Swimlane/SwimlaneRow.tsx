import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { useMemo } from "react";
import ConfigLink from "../../ConfigLink/ConfigLink";
import { BucketCells } from "./BucketCells";
import { SwimlaneConfigRowBase } from "./SwimlaneConfigRowBase";
import { BucketedRow } from "./Utils";

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
  const allChanges = useMemo(() => row.buckets.flat(), [row.buckets]);

  return (
    <SwimlaneConfigRowBase
      label={
        <ConfigLink
          config={row.config}
          configId={row.config?.id}
          className="min-w-0 text-sm text-zinc-600"
        />
      }
      timeline={
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
      }
      severity={row.severity}
      changes={allChanges}
      columnWidth={columnWidth}
      onExpand={onItemClicked}
      onResizeMouseDown={onResizeMouseDown}
      indentLevel={indentLevel}
      even={even}
    />
  );
}
