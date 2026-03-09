import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { Age } from "@flanksource-ui/ui/Age";
import { ChangeIcon } from "@flanksource-ui/ui/Icons/ChangeIcon";
import { relativeDateTime } from "@flanksource-ui/utils/date";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import ConfigsTypeIcon from "../ConfigsTypeIcon";

type ConfigChangesSwimlaneProps = {
  changes: ConfigChange[];
  onItemClicked?: (change: ConfigChange) => void;
};

function calcPercent(
  time: string | undefined,
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

export default function ConfigChangesSwimlane({
  changes,
  onItemClicked = () => {}
}: ConfigChangesSwimlaneProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
      const t = dayjs(c.first_observed).valueOf();
      if (t < min) min = t;
      if (t > max) max = t;
    }

    if (min === Infinity) {
      min = max = Date.now();
    }

    const rows = Array.from(grouped.entries()).map(([name, items]) => ({
      name,
      config: items[0]!.config,
      items
    }));

    return { rows, min, max, ticks: generateTimeTicks(min, max) };
  }, [changes]);

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
      {/* Time axis header */}
      <div className="flex flex-row border-b border-gray-200">
        <div className="w-[200px] shrink-0" />
        <div className="relative flex-1 px-2 py-1">
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
      <div className="flex-1 overflow-y-auto">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex flex-row items-center border-b border-gray-100 hover:bg-gray-50"
            style={{ minHeight: "36px" }}
          >
            {/* Label column */}
            <div className="w-[200px] shrink-0 overflow-hidden truncate px-2 py-1 text-sm">
              <ConfigsTypeIcon config={row.config}>
                <span className="truncate">{row.name}</span>
              </ConfigsTypeIcon>
            </div>

            {/* Markers area */}
            <div className="relative flex-1 px-2" style={{ minHeight: "28px" }}>
              {row.items.map((change) => {
                const pct = calcPercent(change.first_observed, min, max);
                return (
                  <button
                    key={change.id}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer p-0.5 transition-transform hover:scale-125"
                    style={{ left: `${pct}%` }}
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
                );
              })}
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
