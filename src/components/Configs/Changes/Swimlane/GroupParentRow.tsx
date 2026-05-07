import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import ConfigLink from "../../ConfigLink/ConfigLink";
import { BucketCells } from "./BucketCells";
import { SwimlaneConfigRowBase } from "./SwimlaneConfigRowBase";
import { SeverityCounts, SwimlaneGroup, mergeBuckets } from "./Utils";

export function GroupParentRow({
  group,
  collapsed,
  onToggle,
  columnWidth,
  numBuckets,
  onItemClicked,
  onResizeMouseDown,
  min,
  max,
  indentLevel = 0
}: {
  group: SwimlaneGroup;
  collapsed: boolean;
  onToggle: () => void;
  columnWidth: number;
  numBuckets: number;
  onItemClicked: (change: ConfigChange) => void;
  onResizeMouseDown: (e: React.MouseEvent) => void;
  min: number;
  max: number;
  indentLevel?: number;
}) {
  const mergedBuckets = useMemo(
    () => mergeBuckets(group.rows, numBuckets),
    [group.rows, numBuckets]
  );

  const allGroupChanges = useMemo(
    () => group.rows.flatMap((r) => r.buckets.flat()),
    [group.rows]
  );

  const groupSeverity = useMemo(() => {
    const totals: SeverityCounts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
      none: 0,
      total: 0
    };
    for (const row of group.rows) {
      for (const k of Object.keys(totals) as (keyof SeverityCounts)[]) {
        totals[k] += row.severity[k];
      }
    }
    return totals;
  }, [group.rows]);

  const parentRow = group.rows[0]!;
  const displayBuckets = collapsed ? mergedBuckets : parentRow.buckets;
  const Chevron = collapsed ? ChevronRight : ChevronDown;

  return (
    <SwimlaneConfigRowBase
      label={
        <div className="flex min-w-0 items-center gap-1">
          <button
            className="shrink-0 text-gray-600 hover:text-gray-900"
            onClick={onToggle}
          >
            <Chevron className="h-3.5 w-3.5" />
          </button>
          <ConfigLink
            config={parentRow.config}
            configId={parentRow.config?.id}
            className="min-w-0 text-sm font-medium text-zinc-600"
          />
          <span className="shrink-0 text-xs text-gray-400">
            ({group.rows.length})
          </span>
        </div>
      }
      timeline={
        <div className="flex flex-1 flex-row items-stretch border-l border-gray-200">
          {parentRow.preRangeBadge && !collapsed && (
            <span className="flex items-center px-1 text-[10px] text-gray-400">
              {parentRow.preRangeBadge}
            </span>
          )}
          <BucketCells
            buckets={displayBuckets}
            numBuckets={numBuckets}
            onItemClicked={onItemClicked}
            min={min}
            max={max}
          />
        </div>
      }
      severity={groupSeverity}
      changes={allGroupChanges}
      columnWidth={columnWidth}
      onExpand={onItemClicked}
      onResizeMouseDown={onResizeMouseDown}
      indentLevel={indentLevel}
    />
  );
}
