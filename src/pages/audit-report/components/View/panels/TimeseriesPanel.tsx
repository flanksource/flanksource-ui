import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis
} from "recharts";
import { PanelResult } from "../../../types";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@flanksource-ui/components/ui/chart";
import { formatDisplayLabel, getSeriesColor } from "./utils";
import { buildEvenlySpacedRange } from "./timeRange";

interface TimeseriesPanelProps {
  summary: PanelResult;
}

type SeriesMeta = {
  dataKey: string;
  name: string;
  color?: string;
};

const isNumeric = (value: any) =>
  value !== null && value !== undefined && !Number.isNaN(Number(value));

const toSafeId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-");

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const inferTimeKey = (rows: Record<string, any>[], preferred?: string) => {
  if (preferred) return preferred;
  const sample = rows[0] || {};
  const candidates = ["timestamp", "time", "date", "ts"];
  return candidates.find((key) => sample[key] !== undefined);
};

const parseTimestamp = (value: any, index: number) => {
  if (value == null) {
    return { numericValue: index, label: `#${index + 1}` };
  }

  if (value instanceof Date) {
    return { numericValue: value.getTime(), label: value.toISOString() };
  }

  if (typeof value === "number") {
    // Heuristic: values below ~10^11 are likely seconds, convert to ms.
    const numericValue =
      value > 0 && value < 1e12 ? Math.round(value * 1000) : value;
    const dateFromNumber = new Date(numericValue);
    if (!Number.isNaN(dateFromNumber.getTime())) {
      return { numericValue, label: dateFromNumber.toISOString() };
    }
  }

  if (typeof value === "string") {
    // Handle common non-ISO formats like "2025-12-10 12:11:00 +0000 UTC"
    const parsed =
      Date.parse(value) ||
      Date.parse(
        value
          .replace(" UTC", "Z")
          .replace(/\s\+\d{4}\sZ$/, "Z")
          .replace(" ", "T")
      );
    if (!Number.isNaN(parsed)) {
      const date = new Date(parsed);
      return { numericValue: date.getTime(), label: date.toISOString() };
    }
  }

  const parsedDate = new Date(value);
  if (!Number.isNaN(parsedDate.getTime())) {
    return { numericValue: parsedDate.getTime(), label: parsedDate.toString() };
  }

  return { numericValue: index, label: String(value) };
};

const inferValueKey = (rows: Record<string, any>[], timeKey?: string) => {
  const sample = rows[0] || {};
  const numericKeys = Object.keys(sample).filter(
    (key) => key !== timeKey && isNumeric(sample[key])
  );
  if (numericKeys.length > 0) {
    return numericKeys[0];
  }
  const fallback = ["value", "count"].find((key) =>
    rows.some((row) => isNumeric(row[key]))
  );
  return fallback;
};

const renderSmallScatterPoint = (props: any) => {
  const { cx, cy, fill } = props;
  if (cx == null || cy == null) return <g />;
  return <circle cx={cx} cy={cy} r={2} fill={fill} />;
};

const TimeseriesPanel: React.FC<TimeseriesPanelProps> = ({ summary }) => {
  const rows = useMemo(() => summary.rows || [], [summary.rows]);
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [cachedTicks, setCachedTicks] = useState<number[] | undefined>();
  const [cachedDomain, setCachedDomain] = useState<
    [number, number] | undefined
  >();

  useEffect(() => {
    const el = chartWrapperRef.current;
    if (!el) return;

    // Capture width only on first mount to avoid recalculating ticks on every resize.
    setContainerWidth(el.getBoundingClientRect().width);
  }, []);

  const chartStyle: "lines" | "area" | "points" =
    summary.timeseries?.style || "lines";

  const timeKey = useMemo(() => {
    return inferTimeKey(rows, summary.timeseries?.timeKey);
  }, [rows, summary.timeseries?.timeKey]);

  const valueKey = useMemo(() => {
    const explicit = summary.timeseries?.valueKey;
    if (explicit) return explicit;
    return inferValueKey(rows, timeKey);
  }, [rows, summary.timeseries?.valueKey, timeKey]);

  const { chartData, series } = useMemo(() => {
    if (!timeKey || !valueKey) {
      return {
        chartData: [] as Array<Record<string, any>>,
        series: [] as SeriesMeta[]
      };
    }

    const seriesMap = new Map<string, SeriesMeta>();
    const rowsByTs = new Map<number, Record<string, any>>();

    rows.forEach((row, index) => {
      const { numericValue, label } = parseTimestamp(row[timeKey], index);
      if (!Number.isFinite(numericValue)) return;

      const labelKeys = Object.keys(row).filter(
        (key) => key !== timeKey && key !== valueKey
      );
      labelKeys.sort();
      const labelPairs = labelKeys.map((key) => `${key}=${row[key]}`);
      const seriesKey = labelPairs.join(", ") || "default";

      if (!seriesMap.has(seriesKey)) {
        seriesMap.set(seriesKey, {
          dataKey: seriesKey,
          name: seriesKey
        });
      }

      const bucket = rowsByTs.get(numericValue) || {
        __timestamp: numericValue,
        __label: label
      };

      const numericSeriesValue = Number(row[valueKey]);
      bucket[seriesKey] = Number.isFinite(numericSeriesValue)
        ? numericSeriesValue
        : 0;

      rowsByTs.set(numericValue, bucket);
    });

    const sortedData = Array.from(rowsByTs.values()).sort(
      (a, b) => Number(a.__timestamp) - Number(b.__timestamp)
    );

    return {
      chartData: sortedData,
      series: Array.from(seriesMap.values())
    };
  }, [rows, timeKey, valueKey]);

  const timeRange = useMemo(() => {
    if (!chartData.length) return null;
    const timestamps = chartData
      .map((d) => Number(d.__timestamp))
      .filter((v) => Number.isFinite(v));
    if (!timestamps.length) return null;
    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
    return { min, max, span: max - min };
  }, [chartData]);

  useEffect(() => {
    if (!timeRange) return;
    // Cache domain once per data load
    setCachedDomain([timeRange.min, timeRange.max]);
  }, [timeRange]);

  useEffect(() => {
    if (!timeRange || !containerWidth) return;
    const targetTickCount = clamp(Math.floor(containerWidth / 70), 4, 16);
    const spaced = buildEvenlySpacedRange(
      { min: timeRange.min, max: timeRange.max },
      targetTickCount
    );
    setCachedTicks(spaced.ticks);
  }, [timeRange, containerWidth]);

  const timestampToLabel = useMemo(() => {
    return new Map<number | string, string>(
      chartData.map((point) => [point.__timestamp, point.__label])
    );
  }, [chartData]);

  const formatLabel = (value: number | string) => {
    const label = timestampToLabel.get(value);
    if (label) return label;

    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleString();
    }

    return typeof value === "number" ? `#${value + 1}` : String(value);
  };

  const hasNoRows = rows.length === 0;
  const hasNoSeries = series.length === 0 || !timeKey || !valueKey;
  const legendConfig = summary.timeseries?.legend;
  const isLegendEnabled = legendConfig?.enable;
  const legendLayout = legendConfig?.layout || "horizontal";

  const seriesTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    chartData.forEach((point) => {
      series.forEach(({ dataKey }) => {
        const numericValue = Number(point[dataKey]);
        if (Number.isFinite(numericValue)) {
          totals[dataKey] = (totals[dataKey] || 0) + numericValue;
        }
      });
    });

    return totals;
  }, [chartData, series]);

  const seriesWithMeta = useMemo(() => {
    return series.map((serie, index) => {
      const valueOnlyLabel =
        serie.name
          ?.split(",")
          .map((segment) => {
            const trimmed = segment.trim();
            const eqIndex = trimmed.indexOf("=");
            return eqIndex === -1 ? trimmed : trimmed.slice(eqIndex + 1).trim();
          })
          .join(", ") || serie.name;

      const color = serie.color || getSeriesColor(valueOnlyLabel, index);
      const displayLabel =
        formatDisplayLabel(valueOnlyLabel || serie.dataKey || "value") ||
        serie.dataKey;
      const total = seriesTotals[serie.dataKey];

      return { ...serie, color, displayLabel, total };
    });
  }, [series, seriesTotals]);

  const chartConfig = useMemo<ChartConfig>(() => {
    return seriesWithMeta.reduce<ChartConfig>((acc, serie) => {
      acc[serie.dataKey] = {
        label:
          serie.total !== undefined
            ? `${serie.displayLabel} (${serie.total.toLocaleString()})`
            : serie.displayLabel,
        color: serie.color
      };
      return acc;
    }, {});
  }, [seriesWithMeta]);

  return (
    <div className="flex h-full min-h-[250px] w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
      <h4 className="mb-2 text-sm font-medium text-gray-600">{summary.name}</h4>
      {summary.description && (
        <p className="mb-3 text-xs text-gray-500">{summary.description}</p>
      )}

      {hasNoRows || hasNoSeries ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          {hasNoRows
            ? "No data available for timeseries chart."
            : "No numeric data available for timeseries chart."}
        </div>
      ) : (
        <div ref={chartWrapperRef} className="mt-1 flex-1">
          <ChartContainer
            config={chartConfig}
            className="flex h-full min-h-[260px] w-full flex-1 rounded-lg border border-border/60 bg-background/50 px-2 py-3 sm:px-3"
          >
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="__timestamp"
                type="number"
                scale="time"
                domain={cachedDomain}
                ticks={cachedTicks}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={20}
                tickFormatter={(value) => formatTick(value, timeRange)}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                cursor={{ strokeDasharray: "4 4" }}
                content={
                  <ChartTooltipContent
                    indicator={chartStyle === "points" ? "dot" : "line"}
                    labelFormatter={(value) => formatLabel(value as any)}
                  />
                }
              />
              {isLegendEnabled && (
                <ChartLegend
                  layout={legendLayout}
                  verticalAlign={legendLayout === "vertical" ? "top" : "bottom"}
                  content={<ChartLegendContent />}
                />
              )}

              <defs>
                {seriesWithMeta.map((serie) => (
                  <linearGradient
                    key={serie.dataKey}
                    id={`fill-${toSafeId(serie.dataKey)}`}
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={serie.color}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={serie.color}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                ))}
              </defs>

              {seriesWithMeta.map((serie) => {
                if (chartStyle === "area") {
                  return (
                    <Area
                      key={serie.dataKey}
                      type="monotone"
                      dataKey={serie.dataKey}
                      name={serie.displayLabel}
                      stroke={serie.color}
                      fill={`url(#fill-${toSafeId(serie.dataKey)})`}
                      strokeWidth={2}
                      isAnimationActive={false}
                      connectNulls
                    />
                  );
                }

                if (chartStyle === "points") {
                  return (
                    <Scatter
                      key={serie.dataKey}
                      dataKey={serie.dataKey}
                      name={serie.displayLabel}
                      fill={serie.color}
                      isAnimationActive={false}
                      line={{ strokeWidth: 0 }}
                      shape={renderSmallScatterPoint}
                    />
                  );
                }

                return (
                  <Line
                    key={serie.dataKey}
                    type="monotone"
                    dataKey={serie.dataKey}
                    name={serie.displayLabel}
                    stroke={serie.color}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    connectNulls
                  />
                );
              })}
            </ComposedChart>
          </ChartContainer>
        </div>
      )}
    </div>
  );
};

function formatTick(
  value: number,
  timeRange: { min: number; max: number; span: number } | null
) {
  if (!Number.isFinite(value)) return "";
  if (!timeRange) return String(value);

  const date = new Date(value);
  const oneDay = 86_400_000;
  const oneHour = 3_600_000;

  if (timeRange.span >= 30 * oneDay) {
    return date.toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit"
    });
  }

  if (timeRange.span >= 7 * oneDay) {
    return date.toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit"
    });
  }

  if (timeRange.span >= oneDay) {
    return `${date.toLocaleDateString(undefined, {
      month: "2-digit",
      day: "2-digit"
    })} ${date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    })}`;
  }

  if (timeRange.span >= oneHour) {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

export default TimeseriesPanel;
