import { relativeDateTime } from "@flanksource-ui/utils/date";
import dayjs from "dayjs";
import { calcPercent } from "./Utils";

export function TimeAxisHeader({
  columnWidth,
  markersRef,
  ticks,
  min,
  max
}: {
  columnWidth: number;
  markersRef: React.MutableRefObject<HTMLDivElement | null>;
  ticks: number[];
  min: number;
  max: number;
}) {
  return (
    <div className="sticky top-0 z-20 flex flex-row border-b border-gray-200 bg-white">
      <div className="shrink-0" style={{ width: columnWidth }} />
      <div
        className="relative flex-1 border-l border-gray-200 px-2 py-1"
        ref={(el) => {
          markersRef.current = el;
        }}
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
  );
}
