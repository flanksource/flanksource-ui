import React, { useMemo } from "react";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue
} from "react-calendar-heatmap";
import type { HeatmapVariant, PanelResult } from "../../../types";
import PanelHeader from "./PanelHeader";

type CalendarStatus = "success" | "failed" | "none";

type HeatmapValue = ReactCalendarHeatmapValue<string> & {
  date: string;
  successful: number;
  failed: number;
  count: number;
  size?: string;
};

interface HeatmapPanelProps {
  summary: PanelResult;
}

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const SUCCESS_STATUSES = new Set(["success", "successful", "completed"]);
const FAILURE_STATUSES = new Set([
  "failed",
  "failure",
  "error",
  "errored",
  "cancelled",
  "canceled"
]);

const CELL_CLASSES: Record<CalendarStatus, string> = {
  success: "bg-green-50 border border-green-400",
  failed: "bg-red-50 border border-red-400",
  none: "bg-gray-100 border border-gray-200"
};

const CELL_TEXT_CLASSES: Record<CalendarStatus, string> = {
  success: "text-green-700",
  failed: "text-red-600",
  none: "text-gray-400"
};

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toDateKey = (value: unknown): string | null => {
  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) {
      return null;
    }

    if (DATE_ONLY_REGEX.test(normalized)) {
      return normalized;
    }

    const parsed = new Date(normalized);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed.toISOString().slice(0, 10);
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return null;
};

const toSize = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const size = value.trim();
  return size ? size : undefined;
};

const toStatus = (value: unknown): CalendarStatus | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.toLowerCase().trim();
  if (SUCCESS_STATUSES.has(normalized)) {
    return "success";
  }

  if (FAILURE_STATUSES.has(normalized)) {
    return "failed";
  }

  return undefined;
};

const resolveVariant = (summary: PanelResult): HeatmapVariant => {
  const mode = summary.heatmap?.mode;
  return mode === "compact" ? "compact" : "calendar";
};

const buildHeatmapValues = (
  rows: Array<Record<string, unknown>> | undefined
): HeatmapValue[] => {
  const valuesByDate = new Map<string, HeatmapValue>();

  for (const row of rows ?? []) {
    const date = toDateKey(row.date ?? row.day ?? row.timestamp);
    if (!date) {
      continue;
    }

    const status = toStatus(row.status);
    let successful = toNumber(row.successful);
    let failed = toNumber(row.failed);
    let count = toNumber(row.count);

    if (count <= 0) {
      count = successful + failed;
    }

    if (successful <= 0 && failed <= 0) {
      if (status === "success") {
        successful = count > 0 ? count : 1;
      } else if (status === "failed") {
        failed = count > 0 ? count : 1;
      } else if (count > 0) {
        successful = count;
      }
    }

    if (count <= 0) {
      count = successful + failed;
    }

    const size = toSize(row.size);

    const existing = valuesByDate.get(date);
    if (existing) {
      existing.successful += successful;
      existing.failed += failed;
      existing.count += count;
      if (size) {
        existing.size = size;
      }
      continue;
    }

    valuesByDate.set(date, {
      date,
      successful,
      failed,
      count,
      size
    });
  }

  return Array.from(valuesByDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

const getCalendarStatus = (value: HeatmapValue | undefined): CalendarStatus => {
  if (!value) {
    return "none";
  }

  const total = value.count > 0 ? value.count : value.successful + value.failed;
  if (total <= 0) {
    return "none";
  }

  if (value.failed > 0) {
    return "failed";
  }

  if (value.successful > 0) {
    return "success";
  }

  return "none";
};

const getCellLabel = (value: HeatmapValue | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (value.size) {
    return value.size;
  }

  const total = value.count > 0 ? value.count : value.successful + value.failed;
  if (total <= 0) {
    return undefined;
  }

  return `${total}`;
};

const getTooltipText = (
  date: string,
  value: HeatmapValue | undefined
): string => {
  if (!value) {
    return `${date}: No backups`;
  }

  const total = value.count > 0 ? value.count : value.successful + value.failed;
  return `${date}: ${value.successful} successful, ${value.failed} failed (${total} total)`;
};

interface HeatmapMonthGroup {
  key: string;
  values: HeatmapValue[];
}

const groupValuesByMonth = (values: HeatmapValue[]): HeatmapMonthGroup[] => {
  const buckets = new Map<string, HeatmapValue[]>();

  for (const value of values) {
    const key = value.date.slice(0, 7);
    if (!buckets.has(key)) {
      buckets.set(key, []);
    }

    buckets.get(key)!.push(value);
  }

  return Array.from(buckets.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, monthValues]) => ({
      key,
      values: monthValues.sort((a, b) => a.date.localeCompare(b.date))
    }));
};

const CalendarMonthHeatmap: React.FC<{ values: HeatmapValue[] }> = ({
  values
}) => {
  const valuesByDate = useMemo(
    () => new Map(values.map((value) => [value.date, value])),
    [values]
  );

  const referenceDate = useMemo(() => {
    if (values.length === 0) {
      return new Date();
    }

    const latest = new Date(`${values[values.length - 1].date}T00:00:00`);
    if (Number.isNaN(latest.getTime())) {
      return new Date();
    }

    return latest;
  }, [values]);

  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();

  const monthLabel = referenceDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const cells: Array<number | null> = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="mb-1 text-[11px] font-semibold text-slate-700">
        {monthLabel}
      </p>

      <div className="grid grid-cols-7 gap-0.5">
        {DAY_HEADERS.map((day) => (
          <div
            key={day}
            className="pb-0.5 text-center text-[10px] text-gray-500"
          >
            {day}
          </div>
        ))}

        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }

          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const value = valuesByDate.get(key);
          const status = getCalendarStatus(value);
          const label = getCellLabel(value);

          return (
            <div
              key={key}
              title={getTooltipText(key, value)}
              className={`flex min-h-[30px] flex-col justify-between rounded-sm px-1 py-0.5 ${CELL_CLASSES[status]}`}
            >
              <span className="text-[9px] font-semibold leading-none text-gray-700">
                {day}
              </span>
              {label ? (
                <span
                  className={`line-clamp-1 text-[8px] leading-none ${CELL_TEXT_CLASSES[status]}`}
                >
                  {label}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-gray-600">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-green-400 bg-green-50" />
          Success
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-red-400 bg-red-50" />
          Failed
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-gray-200 bg-gray-100" />
          No backup
        </span>
      </div>
    </div>
  );
};

const CompactHeatmap: React.FC<{ values: HeatmapValue[] }> = ({ values }) => {
  const { startDate, endDate } = useMemo(() => {
    if (values.length === 0) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 120);
      return { startDate: start, endDate: end };
    }

    return {
      startDate: new Date(`${values[0].date}T00:00:00`),
      endDate: new Date(`${values[values.length - 1].date}T00:00:00`)
    };
  }, [values]);

  const classForValue = (
    value: ReactCalendarHeatmapValue<string> | undefined
  ): string => {
    if (!value?.date) {
      return "fill-gray-100";
    }

    const current = value as HeatmapValue;
    const total =
      current.count > 0 ? current.count : current.successful + current.failed;

    if (total <= 0) {
      return "fill-gray-100";
    }

    if (current.failed <= 0) {
      return "fill-green-200";
    }

    const successRatio = current.successful / total;
    if (successRatio >= 0.5) {
      return "fill-orange-200";
    }

    return "fill-red-200";
  };

  const titleForValue = (
    value: ReactCalendarHeatmapValue<string> | undefined
  ): string => {
    if (!value?.date) {
      return "No data";
    }

    return getTooltipText(value.date, value as HeatmapValue);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="view-heatmap-chart flex-1 overflow-hidden">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          gutterSize={2}
          classForValue={classForValue}
          titleForValue={titleForValue}
        />
      </div>

      <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-green-200" />
          Success
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-orange-200" />
          Mixed
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-red-200" />
          Failed
        </span>
      </div>

      <style jsx global>{`
        .view-heatmap-chart .react-calendar-heatmap {
          width: 100%;
          height: 150px;
        }
      `}</style>
    </div>
  );
};

const HeatmapPanel: React.FC<HeatmapPanelProps> = ({ summary }) => {
  const values = useMemo<HeatmapValue[]>(() => {
    return buildHeatmapValues(
      summary.rows as Array<Record<string, unknown>> | undefined
    );
  }, [summary.rows]);

  const variant: HeatmapVariant = resolveVariant(summary);
  const monthGroups = useMemo(() => groupValuesByMonth(values), [values]);

  const renderCard = (cardKey: string, cardValues: HeatmapValue[]) => (
    <div
      key={cardKey}
      className="flex h-[300px] w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4"
    >
      <PanelHeader
        title={summary.name}
        description={summary.description}
        titleClassName="capitalize"
      />

      {variant === "compact" ? (
        <CompactHeatmap values={cardValues} />
      ) : (
        <CalendarMonthHeatmap values={cardValues} />
      )}
    </div>
  );

  if (variant === "compact" || monthGroups.length <= 1) {
    return renderCard(`${summary.name}-all`, values);
  }

  return (
    <>
      {monthGroups.map((group) =>
        renderCard(`${summary.name}-${group.key}`, group.values)
      )}
    </>
  );
};

export default HeatmapPanel;
