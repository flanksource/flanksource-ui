import { ConfigChange } from "@flanksource-ui/api/types/configs";
import {
  HoverCard,
  HoverCardTrigger
} from "@flanksource-ui/components/ui/hover-card";
import { PortaledHoverCardContent as HoverCardContent } from "@flanksource-ui/components/ui/portaled-hover-card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { SeverityCounts, SwimlaneGroup, mergeBuckets } from "./Utils";
import { BucketCells } from "./BucketCells";
import { ResizeHandle } from "./ResizeHandle";
import { SeverityBadges } from "./SeverityBadges";

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

  const Chevron = collapsed ? ChevronRight : ChevronDown;
  const groupType = group.type?.split("::").at(-1);

  return (
    <div
      className="flex flex-row border-b border-gray-100 bg-gray-50/50 hover:bg-gray-100/50"
      style={{ minHeight: "36px" }}
    >
      <div
        className="sticky left-0 z-10 flex shrink-0 items-center gap-3 overflow-hidden bg-white px-2 py-1 text-sm shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]"
        style={{ width: columnWidth }}
      >
        <button
          className="mr-1 flex min-w-0 flex-1 items-center gap-1 text-gray-600 hover:text-gray-900"
          style={{ paddingLeft: indentLevel * 24 }}
          onClick={onToggle}
        >
          <Chevron className="h-3.5 w-3.5 shrink-0" />
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <span className="truncate font-medium">{group.prefix}</span>
            </HoverCardTrigger>
            {groupType && (
              <HoverCardContent
                side="top"
                align="start"
                collisionPadding={16}
                className="w-fit p-0"
              >
                <div className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-700 shadow-sm">
                  {groupType}
                </div>
              </HoverCardContent>
            )}
          </HoverCard>
          <span className="shrink-0 text-xs text-gray-400">
            ({group.rows.length})
          </span>
        </button>
        <span className="h-4 w-px shrink-0 bg-gray-200" />
        <SeverityBadges
          severity={groupSeverity}
          changes={allGroupChanges}
          onExpand={onItemClicked}
        />
        <ResizeHandle onMouseDown={onResizeMouseDown} />
      </div>
      {collapsed && (
        <div className="flex flex-1 flex-row items-stretch border-l border-gray-200">
          <BucketCells
            buckets={mergedBuckets}
            numBuckets={numBuckets}
            onItemClicked={onItemClicked}
            min={min}
            max={max}
          />
        </div>
      )}
    </div>
  );
}
