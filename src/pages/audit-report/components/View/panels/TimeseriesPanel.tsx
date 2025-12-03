import React, { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  Area,
  Scatter,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { PanelResult } from "../../../types";
import { formatDisplayLabel, textToHex } from "./utils";

interface TimeseriesPanelProps {
  summary: PanelResult;
}

type SeriesMeta = { dataKey: string; name: string; color?: string };

const isNumeric = (value: any) =>
  value !== null && value !== undefined && !Number.isNaN(Number(value));

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
        seriesMap.set(seriesKey, { dataKey: seriesKey, name: seriesKey });
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

  return (
    <div className="flex h-full min-h-[320px] w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
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
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                tick={{ style: { fontSize: "0.6em" } }}
                dataKey="__timestamp"
                domain={["auto", "auto"]}
                type="number"
                tickFormatter={formatLabel}
                minTickGap={20}
              />
              <YAxis tick={{ style: { fontSize: "0.6em" } }} />
              <Tooltip
                labelFormatter={(value) => formatLabel(value)}
                formatter={(value: number) => value}
              />
              {/* <Legend
                wrapperStyle={{ fontSize: "0.6em" }}
                payload={undefined}
              /> */}

              {series.map((serie, index) => {
                const color = serie.color || textToHex(serie.name);

                return chartStyle === "area" ? (
                  <Area
                    key={serie.dataKey}
                    type="monotone"
                    dataKey={serie.dataKey}
                    name={
                      serie.name || formatDisplayLabel(serie.dataKey || "value")
                    }
                    stroke={color}
                    fill={color}
                    fillOpacity={0.2}
                    isAnimationActive={false}
                    connectNulls
                  />
                ) : chartStyle === "points" ? (
                  <Scatter
                    key={serie.dataKey}
                    dataKey={serie.dataKey}
                    name={
                      serie.name || formatDisplayLabel(serie.dataKey || "value")
                    }
                    fill={color}
                    isAnimationActive={false}
                    line={{ strokeWidth: 0 }}
                    shape={renderSmallScatterPoint}
                  />
                ) : (
                  <Line
                    key={serie.dataKey}
                    type="monotone"
                    dataKey={serie.dataKey}
                    name={
                      serie.name || formatDisplayLabel(serie.dataKey || "value")
                    }
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    connectNulls
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TimeseriesPanel;
