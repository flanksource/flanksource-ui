import React, { useMemo } from "react";
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

  const dateFromNumber = new Date(Number(value));
  if (typeof value === "number" && !Number.isNaN(dateFromNumber.getTime())) {
    return { numericValue: value, label: dateFromNumber.toISOString() };
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
        <ChartContainer
          config={chartConfig}
          className="mt-1 flex-1 rounded-lg border border-border/60 bg-background/50 px-2 py-3 sm:px-3"
        >
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="__timestamp"
              type="number"
              domain={["dataMin", "dataMax"]}
              scale="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
              tickFormatter={formatLabel}
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
      )}
    </div>
  );
};

export default TimeseriesPanel;
