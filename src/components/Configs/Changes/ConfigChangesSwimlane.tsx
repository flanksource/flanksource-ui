import { ConfigChange } from "@flanksource-ui/api/types/configs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@flanksource-ui/components/ui/hover-card";
import { Age } from "@flanksource-ui/ui/Age";
import { ChangeIcon } from "@flanksource-ui/ui/Icons/ChangeIcon";
import { relativeDateTime } from "@flanksource-ui/utils/date";
import dayjs from "dayjs";
import {
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Info,
  Maximize2,
  OctagonAlert,
  TriangleAlert
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import ConfigChangesSwimlaneLegend from "./ConfigChangesSwimlaneLegend";
import {
  GroupedSwimlaneTooltip,
  SwimlaneTooltip
} from "./ConfigChangesSwimlaneTooltip";
import {
  BucketedRow,
  BUCKET_MIN_PX,
  LabelPlacement,
  MAX_COLUMN_WIDTH,
  MIN_COLUMN_WIDTH,
  SeverityCounts,
  SwimlaneGroup,
  bucketChanges,
  calcPercent,
  computeLabelPlacements,
  countSeverities,
  filterBySeverity,
  generateTimeTicks,
  groupBucketByType,
  groupRowsByPrefix,
  mergeBuckets,
  useContainerWidth,
  useResizableColumn
} from "./ConfigChangesSwimlaneUtils";

const severityEntries: { key: keyof SeverityCounts; icon: React.ReactNode }[] =
  [
    {
      key: "critical",
      icon: <OctagonAlert className="h-4 w-4 text-red-600" />
    },
    { key: "high", icon: <CircleAlert className="h-4 w-4 text-red-500" /> },
    {
      key: "medium",
      icon: <TriangleAlert className="h-4 w-4 text-orange-500" />
    },
    { key: "low", icon: <Info className="h-4 w-4 text-orange-400" /> },
    { key: "info", icon: <Info className="h-4 w-4 text-blue-400" /> }
  ];

function SeverityBadges({
  severity,
  changes,
  onExpand
}: {
  severity: SeverityCounts;
  changes: ConfigChange[];
  onExpand: (change: ConfigChange) => void;
}) {
  const visible = severityEntries.filter(({ key }) => severity[key] > 0);
  if (visible.length === 0) return null;
  return (
    <div className="flex shrink-0 items-center gap-1">
      {visible.map(({ key, icon }) => {
        const matched = filterBySeverity(changes, key);
        return (
          <HoverCard key={key} openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <span className="relative inline-flex cursor-pointer items-center">
                {icon}
                {severity[key] > 1 && (
                  <span className="absolute -right-1.5 -top-1 flex h-3 min-w-3 items-center justify-center rounded-full bg-zinc-400 px-0.5 text-[8px] font-light leading-none text-white">
                    {severity[key]}
                  </span>
                )}
              </span>
            </HoverCardTrigger>
            <HoverCardContent
              side="bottom"
              align="start"
              collisionPadding={16}
              className="w-fit min-w-56 max-w-lg p-0"
            >
              <SeverityTooltip
                changes={matched}
                severityKey={key}
                onExpand={onExpand}
              />
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </div>
  );
}

function SeverityTooltip({
  changes,
  severityKey,
  onExpand
}: {
  changes: ConfigChange[];
  severityKey: string;
  onExpand: (change: ConfigChange) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-gray-100 p-2 text-black shadow-sm">
      <span className="text-xs font-medium capitalize text-gray-600">
        {severityKey}
      </span>
      <div className="flex flex-col gap-1.5 divide-y divide-gray-300">
        {changes.slice(0, 5).map((change) => (
          <div
            key={change.id}
            className="flex items-center gap-2 pt-1.5 text-xs first:pt-0"
          >
            <span className="flex shrink-0 items-center gap-1 font-medium">
              <ChangeIcon change={change} className="h-4 w-4" />
              {change.change_type}
            </span>
            <span className="h-3 w-px shrink-0 bg-gray-300" />
            <span className="shrink-0 whitespace-nowrap text-gray-500">
              <Age from={change.first_observed} />
            </span>
            {change.summary && (
              <>
                <span className="h-3 w-px shrink-0 bg-gray-300" />
                <span className="truncate text-gray-600">{change.summary}</span>
              </>
            )}
            <span className="flex-1" />
            <button
              className="shrink-0 rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                onExpand(change);
              }}
              title="View full details"
            >
              <Maximize2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      {changes.length > 5 && (
        <span className="border-t border-gray-300 pt-1 text-xs text-gray-500">
          +{changes.length - 5} more
        </span>
      )}
    </div>
  );
}

type ConfigChangesSwimlaneProps = {
  changes: ConfigChange[];
  onItemClicked?: (change: ConfigChange) => void;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

function ExtraDot({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="h-2 w-2 shrink-0 rounded-full bg-gray-300" />
      <span className="whitespace-nowrap text-xs text-gray-400">{text}</span>
    </span>
  );
}

function ChangeIconWithBadge({
  group
}: {
  group: ReturnType<typeof groupBucketByType>[number];
}) {
  const hasBadge = group.count > 1;
  return (
    <span
      className={`relative inline-flex items-center ${hasBadge ? "mr-1" : ""}`}
    >
      <ChangeIcon change={group.representative} className="h-5 w-5" />
      {hasBadge && (
        <span className="absolute -right-1 -top-0.5 flex h-3 min-w-3 items-center justify-center rounded-full bg-zinc-400 px-0.5 text-[7px] font-light leading-none text-white">
          {group.count}
        </span>
      )}
    </span>
  );
}

function FlexLabel({ text }: { text: string }) {
  return (
    <span className="whitespace-nowrap text-xs text-gray-400">{text}</span>
  );
}

function IconWithLabel({
  group,
  labelPlacement,
  onItemClicked
}: {
  group: ReturnType<typeof groupBucketByType>[number];
  labelPlacement: LabelPlacement;
  onItemClicked: (change: ConfigChange) => void;
}) {
  const tooltip =
    group.count === 1 ? (
      <SwimlaneTooltip
        change={group.representative}
        onExpand={() => onItemClicked(group.representative)}
      />
    ) : (
      <GroupedSwimlaneTooltip group={group} onExpand={onItemClicked} />
    );

  if (labelPlacement === "extra") {
    return (
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button
            className="inline-flex cursor-pointer items-center"
            onClick={() => onItemClicked(group.representative)}
          >
            <ExtraDot text={group.representative.change_type} />
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          side="top"
          align="end"
          collisionPadding={16}
          className="w-fit min-w-56 max-w-lg p-0"
        >
          {tooltip}
        </HoverCardContent>
      </HoverCard>
    );
  }

  const type = group.representative.change_type;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          className="inline-flex cursor-pointer items-center gap-0.5"
          onClick={() => onItemClicked(group.representative)}
        >
          {labelPlacement === "left" && <FlexLabel text={type} />}
          <ChangeIconWithBadge group={group} />
          {labelPlacement === "right" && <FlexLabel text={type} />}
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="end"
        collisionPadding={16}
        className="w-fit min-w-56 max-w-lg p-0"
      >
        {tooltip}
      </HoverCardContent>
    </HoverCard>
  );
}

function BucketCells({
  buckets,
  numBuckets,
  onItemClicked,
  min,
  max
}: {
  buckets: ConfigChange[][];
  numBuckets: number;
  onItemClicked: (change: ConfigChange) => void;
  min: number;
  max: number;
}) {
  const placements = useMemo(
    () => computeLabelPlacements(buckets, numBuckets, min, max),
    [buckets, numBuckets, min, max]
  );

  return (
    <>
      {buckets.map((bucket, bIdx) => {
        const grouped = groupBucketByType(bucket);

        const nextBucketEmpty = !buckets[bIdx + 1]?.length;

        return (
          <div
            key={bIdx}
            className={`flex flex-nowrap items-center gap-1 border-r border-dotted border-gray-200 py-1 last:border-r-0 ${nextBucketEmpty ? "" : "overflow-hidden"}`}
            style={{ width: `${100 / numBuckets}%` }}
          >
            {grouped.map((group, gIdx) => {
              const key = `${bIdx}-${gIdx}`;
              const placed = placements.get(key);
              const labelPlacement = placed?.label ?? "none";

              return (
                <IconWithLabel
                  key={key}
                  group={group}
                  labelPlacement={labelPlacement}
                  onItemClicked={onItemClicked}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

function SwimlaneRow({
  row,
  columnWidth,
  numBuckets,
  onItemClicked,
  onResizeMouseDown,
  min,
  max,
  indent = false,
  even = false
}: {
  row: BucketedRow;
  columnWidth: number;
  numBuckets: number;
  onItemClicked: (change: ConfigChange) => void;
  onResizeMouseDown: (e: React.MouseEvent) => void;
  min: number;
  max: number;
  indent?: boolean;
  even?: boolean;
}) {
  const bg = even ? "bg-gray-50/40" : "bg-white";
  const allChanges = useMemo(() => row.buckets.flat(), [row.buckets]);
  return (
    <div
      className={`flex flex-row border-b border-gray-100 hover:bg-gray-100/50 ${bg}`}
      style={{ minHeight: "36px" }}
    >
      <div
        className={`sticky left-0 z-10 flex shrink-0 items-center gap-3 overflow-hidden px-2 py-1 text-sm shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)] ${bg}`}
        style={{ width: columnWidth }}
      >
        <div className={`min-w-0 flex-1 truncate ${indent ? "pl-6" : ""}`}>
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
        <div
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:border-r hover:border-gray-400"
          onMouseDown={onResizeMouseDown}
        />
      </div>
      <div className="flex flex-1 flex-row items-stretch border-l border-gray-200">
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

function GroupParentRow({
  group,
  collapsed,
  onToggle,
  columnWidth,
  numBuckets,
  onItemClicked,
  onResizeMouseDown,
  min,
  max
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
          onClick={onToggle}
        >
          <Chevron className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate font-medium">{group.prefix}</span>
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
        <div
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:border-r hover:border-gray-400"
          onMouseDown={onResizeMouseDown}
        />
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

export default function ConfigChangesSwimlane({
  changes,
  onItemClicked = () => {},
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
}: ConfigChangesSwimlaneProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
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

  const sentinelRef = useRef<HTMLDivElement>(null);

  const toggleGroup = useCallback((prefix: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(prefix)) next.delete(prefix);
      else next.add(prefix);
      return next;
    });
  }, []);

  useEffect(() => {
    if (
      !sentinelRef.current ||
      !fetchNextPage ||
      !hasNextPage ||
      isFetchingNextPage
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) fetchNextPage();
      },
      { threshold: 0 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (changes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        No changes to display
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full flex-col overflow-auto"
    >
      {/* Time axis header — sticky top */}
      <div className="sticky top-0 z-20 flex flex-row border-b border-gray-200 bg-white">
        <div className="shrink-0" style={{ width: columnWidth }} />
        <div
          className="relative flex-1 border-l border-gray-200 px-2 py-1"
          ref={markersRef}
        >
          <div className="relative h-5">
            {ticks.map((tick) => {
              const pct = calcPercent(dayjs(tick).toISOString(), min, max);
              return (
                <span
                  key={tick}
                  className="absolute -translate-x-1/2 text-xs text-gray-500"
                  style={{ left: `${pct}%` }}
                >
                  {relativeDateTime(dayjs(tick).toISOString())}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <ConfigChangesSwimlaneLegend changes={changes} />

      {/* Swimlane rows */}
      <div className="flex-1">
        {(() => {
          let rowIdx = 0;
          return groups.map((group) => {
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
          });
        })()}
      </div>

      {/* Sentinel for infinite scroll */}
      {hasNextPage && <div ref={sentinelRef} className="h-1" />}

      {/* Loading indicator for infinite scroll */}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-3 text-sm text-gray-400">
          Loading more changes...
        </div>
      )}
    </div>
  );
}
