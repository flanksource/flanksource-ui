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
  SwimlaneGroup,
  bucketChanges,
  countSeverities,
  generateTimeTicks,
  groupRowsByPath,
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
      const key = c.config_id ?? c.config?.id ?? c.id;
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
      ([configId, items]) => {
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
        const config = items[0]!.config;
        const parentPath = items[0]!.path ?? config?.path;
        const path = parentPath ? `${parentPath}.${configId}` : configId;
        return {
          name: config?.name ?? items[0]!.name ?? configId,
          path,
          config,
          buckets,
          preRangeBadge,
          severity: countSeverities(items),
          lastObserved: sorted[0]?.created_at,
          totalCount
        };
      }
    );

    return {
      groups: groupRowsByPath(rows),
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

  const renderGroup = (
    group: SwimlaneGroup,
    indentLevel = 0
  ): React.ReactNode => {
    if (!group.isGroup) {
      const even = rowIdx % 2 === 0;
      rowIdx++;
      return (
        <SwimlaneRow
          key={group.path ?? group.prefix}
          row={group.rows[0]!}
          columnWidth={columnWidth}
          numBuckets={numBuckets}
          onItemClicked={onItemClicked}
          onResizeMouseDown={onResizeMouseDown}
          min={min}
          max={max}
          indentLevel={indentLevel}
          even={even}
        />
      );
    }

    const groupKey = group.path ?? group.prefix;
    const collapsed = collapsedGroups.has(groupKey);
    rowIdx++;
    return (
      <div key={groupKey}>
        <GroupParentRow
          group={group}
          collapsed={collapsed}
          onToggle={() => toggleGroup(groupKey)}
          columnWidth={columnWidth}
          numBuckets={numBuckets}
          onItemClicked={onItemClicked}
          onResizeMouseDown={onResizeMouseDown}
          min={min}
          max={max}
          indentLevel={indentLevel}
        />
        {!collapsed &&
          group.children?.map((child) => renderGroup(child, indentLevel + 1))}
      </div>
    );
  };

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

      <div className="flex-1">{groups.map((group) => renderGroup(group))}</div>
    </div>
  );
}
