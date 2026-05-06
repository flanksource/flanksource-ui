import { ConfigChange } from "@flanksource-ui/api/types/configs";
import dayjs from "dayjs";
import { useCallback, useMemo, useRef, useState } from "react";
import ConfigChangesSwimlaneLegend from "./Swimlane/Legend";
import {
  EmptySwimlaneState,
  GroupParentRow,
  LoadingSwimlaneState,
  SwimlaneRow,
  TimeAxisHeader
} from "./Swimlane";
import {
  BucketedRow,
  BUCKET_MIN_PX,
  MAX_COLUMN_WIDTH,
  MIN_COLUMN_WIDTH,
  bucketChanges,
  countSeverities,
  generateTimeTicks,
  groupRowsByPrefix,
  useContainerWidth,
  useResizableColumn
} from "./Swimlane/Utils";

type ConfigChangesSwimlaneProps = {
  changes: ConfigChange[];
  isLoading?: boolean;
  onItemClicked?: (change: ConfigChange) => void;
};

export default function ConfigChangesSwimlane({
  changes,
  isLoading,
  onItemClicked = () => {}
}: ConfigChangesSwimlaneProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<HTMLDivElement | null>(null);
  const containerWidth = useContainerWidth(containerRef);
  const initialColumnWidth = Math.min(
    MAX_COLUMN_WIDTH,
    Math.max(MIN_COLUMN_WIDTH, Math.round(containerWidth * 0.3))
  );
  const { width: columnWidth, onMouseDown: onResizeMouseDown } =
    useResizableColumn(initialColumnWidth);
  const markersWidth = useContainerWidth(markersRef);
  const numBuckets = Math.max(1, Math.floor(markersWidth / BUCKET_MIN_PX));

  const { groups, min, max, ticks } = useMemo(() => {
    const grouped = new Map<string, ConfigChange[]>();
    for (const c of changes) {
      const key = c.config?.name ?? c.config_id ?? "unknown";
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(c);
    }

    let min = Infinity;
    let max = -Infinity;
    for (const c of changes) {
      const t = dayjs(c.created_at).valueOf();
      if (t < min) min = t;
      if (t > max) max = t;
    }

    if (min === Infinity) {
      min = max = Date.now();
    }

    const rows: BucketedRow[] = Array.from(grouped.entries()).map(
      ([name, items]) => {
        const { buckets, preRangeBadge } = bucketChanges(
          items,
          numBuckets,
          min,
          max
        );
        const sorted = [...items].sort(
          (a, b) =>
            dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf()
        );
        const totalCount = items.reduce((sum, c) => sum + (c.count || 1), 0);
        return {
          name,
          config: items[0]!.config,
          buckets,
          preRangeBadge,
          severity: countSeverities(items),
          lastObserved: sorted[0]?.created_at,
          totalCount
        };
      }
    );

    return {
      groups: groupRowsByPrefix(rows),
      min,
      max,
      ticks: generateTimeTicks(min, max)
    };
  }, [changes, numBuckets]);

  const toggleGroup = useCallback((prefix: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(prefix)) next.delete(prefix);
      else next.add(prefix);
      return next;
    });
  }, []);

  if (isLoading) return <LoadingSwimlaneState />;
  if (changes.length === 0) return <EmptySwimlaneState />;

  let rowIdx = 0;

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full flex-col overflow-auto"
    >
      <TimeAxisHeader
        columnWidth={columnWidth}
        markersRef={markersRef}
        ticks={ticks}
        min={min}
        max={max}
      />

      <ConfigChangesSwimlaneLegend changes={changes} />

      <div className="flex-1">
        {groups.map((group) => {
          if (!group.isGroup) {
            const even = rowIdx % 2 === 0;
            rowIdx++;
            return (
              <SwimlaneRow
                key={group.prefix}
                row={group.rows[0]!}
                columnWidth={columnWidth}
                numBuckets={numBuckets}
                onItemClicked={onItemClicked}
                onResizeMouseDown={onResizeMouseDown}
                min={min}
                max={max}
                even={even}
              />
            );
          }

          const collapsed = collapsedGroups.has(group.prefix);
          rowIdx++;
          return (
            <div key={group.prefix}>
              <GroupParentRow
                group={group}
                collapsed={collapsed}
                onToggle={() => toggleGroup(group.prefix)}
                columnWidth={columnWidth}
                numBuckets={numBuckets}
                onItemClicked={onItemClicked}
                onResizeMouseDown={onResizeMouseDown}
                min={min}
                max={max}
              />
              {!collapsed &&
                group.rows.map((row) => {
                  const even = rowIdx % 2 === 0;
                  rowIdx++;
                  return (
                    <SwimlaneRow
                      key={row.name}
                      row={row}
                      columnWidth={columnWidth}
                      numBuckets={numBuckets}
                      onItemClicked={onItemClicked}
                      onResizeMouseDown={onResizeMouseDown}
                      min={min}
                      max={max}
                      indent
                      even={even}
                    />
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
