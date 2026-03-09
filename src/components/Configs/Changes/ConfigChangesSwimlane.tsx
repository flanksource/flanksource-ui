import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { Age } from "@flanksource-ui/ui/Age";
import { ChangeIcon } from "@flanksource-ui/ui/Icons/ChangeIcon";
import { relativeDateTime } from "@flanksource-ui/utils/date";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConfigsTypeIcon from "../ConfigsTypeIcon";

type ConfigChangesSwimlaneProps = {
  changes: ConfigChange[];
  onItemClicked?: (change: ConfigChange) => void;
};

function calcPercent(
  time: string | Date | undefined,
  min: number,
  max: number
): number {
  const t = dayjs(time).valueOf();
  return max === min ? 50 : ((t - min) / (max - min)) * 100;
}

function generateTimeTicks(min: number, max: number, count = 6): number[] {
  if (min === max) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
}

type TooltipState = {
  change: ConfigChange;
  x: number;
  y: number;
};

function SwimlaneTooltip({ change }: { change: ConfigChange }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-gray-100 p-2 text-black shadow-sm">
      <ConfigsTypeIcon config={change.config}>
        {change.config?.name}
      </ConfigsTypeIcon>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2 text-xs">
          <span className="flex flex-row items-center gap-1 font-semibold">
            <ChangeIcon change={change} />
            {change.change_type}
          </span>
          <span className="font-semibold">
            <Age from={change.first_observed} />
            {(change.count || 1) > 1 && (
              <span className="inline-block pl-1 text-gray-500">
                (x{change.count} over <Age from={change.first_observed} />)
              </span>
            )}
          </span>
        </div>
        <p className="text-xs">{change.summary}</p>
      </div>
    </div>
  );
}

const ICON_WIDTH = 20;
const BUCKET_MIN_PX = ICON_WIDTH * 5;
const MIN_COLUMN_WIDTH = 150;
const MAX_COLUMN_WIDTH = 500;
const DEFAULT_COLUMN_WIDTH = 300;

function useResizableColumn(initial: number) {
  const [width, setWidth] = useState(initial);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startWidth.current = width;

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const delta = ev.clientX - startX.current;
        setWidth(
          Math.min(
            MAX_COLUMN_WIDTH,
            Math.max(MIN_COLUMN_WIDTH, startWidth.current + delta)
          )
        );
      };

      const onMouseUp = () => {
        dragging.current = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [width]
  );

  return { width, onMouseDown };
}

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  return containerWidth;
}

type BucketedRow = {
  name: string;
  config: ConfigChange["config"];
  buckets: ConfigChange[][];
  preRangeBadge?: string;
};

function bucketChanges(
  items: ConfigChange[],
  numBuckets: number,
  min: number,
  max: number
): { buckets: ConfigChange[][]; preRangeBadge?: string } {
  const buckets: ConfigChange[][] = Array.from(
    { length: numBuckets },
    () => []
  );

  let preRangeFirstObserved: string | undefined;

  for (const change of items) {
    const pct = calcPercent(change.created_at, min, max);
    const idx = Math.min(
      numBuckets - 1,
      Math.max(0, Math.floor((pct / 100) * numBuckets))
    );
    buckets[idx]!.push(change);

    const fo = dayjs(change.first_observed);
    const ca = dayjs(change.created_at);
    if (fo.isBefore(dayjs(min)) && ca.diff(fo, "minute") > 1) {
      if (!preRangeFirstObserved || fo.isBefore(dayjs(preRangeFirstObserved))) {
        preRangeFirstObserved = change.first_observed;
      }
    }
  }

  return {
    buckets,
    preRangeBadge: preRangeFirstObserved
      ? `↩ ${relativeDateTime(preRangeFirstObserved, dayjs(min).toISOString())}`
      : undefined
  };
}

export default function ConfigChangesSwimlane({
  changes,
  onItemClicked = () => {}
}: ConfigChangesSwimlaneProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement>(null);
  const { width: columnWidth, onMouseDown: onResizeMouseDown } =
    useResizableColumn(DEFAULT_COLUMN_WIDTH);
  const markersWidth = useContainerWidth(markersRef);
  const numBuckets = Math.max(1, Math.floor(markersWidth / BUCKET_MIN_PX));

  const { rows, min, max, ticks } = useMemo(() => {
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
        return { name, config: items[0]!.config, buckets, preRangeBadge };
      }
    );

    return { rows, min, max, ticks: generateTimeTicks(min, max) };
  }, [changes, numBuckets]);

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
        <div className="relative flex-1 px-2 py-1" ref={markersRef}>
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

      {/* Swimlane rows */}
      <div className="flex-1">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex flex-row border-b border-gray-100 hover:bg-gray-50"
            style={{ minHeight: "36px" }}
          >
            {/* Label column — sticky left */}
            <div
              className="sticky left-0 z-10 flex shrink-0 items-center overflow-hidden truncate bg-white px-2 py-1 text-sm"
              style={{ width: columnWidth }}
            >
              <ConfigsTypeIcon config={row.config}>
                <span className="truncate">{row.name}</span>
              </ConfigsTypeIcon>
              {/* Resize handle */}
              <div
                className="absolute right-0 top-0 h-full w-1 cursor-col-resize border-r border-transparent hover:border-gray-400"
                onMouseDown={onResizeMouseDown}
              />
            </div>

            {/* Markers area — buckets */}
            <div className="flex flex-1 flex-row items-stretch">
              {row.preRangeBadge && (
                <span className="flex items-center px-1 text-[10px] text-gray-400">
                  {row.preRangeBadge}
                </span>
              )}
              {row.buckets.map((bucket, bIdx) => (
                <div
                  key={bIdx}
                  className="inline-flex flex-wrap items-center gap-0.5 py-0.5"
                  style={{ width: `${100 / numBuckets}%` }}
                >
                  {bucket.map((change) => {
                    const foInRange =
                      dayjs(change.first_observed).valueOf() >= min &&
                      dayjs(change.created_at).diff(
                        dayjs(change.first_observed),
                        "minute"
                      ) > 1;

                    return (
                      <span
                        key={change.id}
                        className="inline-flex items-center"
                      >
                        {foInRange && (
                          <span
                            className="mr-0.5 inline-block h-1.5 w-1.5 rounded-full bg-gray-300"
                            title={`First observed: ${change.first_observed}`}
                          />
                        )}
                        <button
                          className="cursor-pointer p-0.5 transition-transform hover:scale-125"
                          onClick={() => onItemClicked(change)}
                          onMouseEnter={(e) => {
                            const rect =
                              containerRef.current?.getBoundingClientRect();
                            if (!rect) return;
                            setTooltip({
                              change,
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        >
                          <ChangeIcon change={change} className="h-4 w-4" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-50"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          <SwimlaneTooltip change={tooltip.change} />
        </div>
      )}
    </div>
  );
}
