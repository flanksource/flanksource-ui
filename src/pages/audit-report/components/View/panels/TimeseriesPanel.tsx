import React, { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { PanelResult, TimeseriesSeriesConfig } from "../../../types";
import { COLOR_PALETTE, formatDisplayLabel } from "./utils";

interface TimeseriesPanelProps {
  summary: PanelResult;
}

const isNumeric = (value: any) =>
  value !== null && value !== undefined && !Number.isNaN(Number(value));

const inferTimeKey = (rows: Record<string, any>[], preferred?: string) => {
  if (preferred) return preferred;
  const sample = rows[0] || {};
  const candidates = ["timestamp", "time", "date", "ts"];
  return candidates.find((key) => sample[key] !== undefined);
};

const inferSeries = (
  rows: Record<string, any>[],
  timeKey?: string,
  config?: PanelResult["timeseries"]
): TimeseriesSeriesConfig[] => {
  if (config?.series?.length) {
    return config.series;
  }

  const sample = rows[0] || {};
  const numericKeys = Object.keys(sample).filter(
    (key) => key !== timeKey && isNumeric(sample[key])
  );

  if (config?.valueKey) {
    if (numericKeys.includes(config.valueKey)) {
      return [
        { dataKey: config.valueKey },
        ...numericKeys
          .filter((key) => key !== config.valueKey)
          .map((key) => ({ dataKey: key }))
      ];
    }
    return [{ dataKey: config.valueKey }];
  }

  const fallbackKeys =
    numericKeys.length > 0
      ? numericKeys
      : ["value", "count"].filter((key) =>
          rows.some((row) => isNumeric(row[key]))
        );

  return fallbackKeys.map((key) => ({ dataKey: key }));
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

const TimeseriesPanel: React.FC<TimeseriesPanelProps> = ({ summary }) => {
  const rows = useMemo(() => summary.rows || [], [summary.rows]);

  const timeKey = useMemo(
    () => inferTimeKey(rows, summary.timeseries?.timeKey),
    [rows, summary.timeseries]
  );

  const series = useMemo(
    () => inferSeries(rows, timeKey, summary.timeseries),
    [rows, summary.timeseries, timeKey]
  );

  const chartData = useMemo(() => {
    return rows.map((row, index) => {
      const { numericValue, label } = parseTimestamp(
        timeKey ? row[timeKey] : undefined,
        index
      );

      const entry: Record<string, any> = {
        __timestamp: numericValue,
        __label: label
      };

      series.forEach((serie) => {
        const rawValue = row[serie.dataKey];
        const numericSeriesValue = Number(rawValue);
        entry[serie.dataKey] = Number.isFinite(numericSeriesValue)
          ? numericSeriesValue
          : 0;
      });

      return entry;
    });
  }, [rows, series, timeKey]);

  const timestampToLabel = useMemo(() => {
    return new Map<number | string, string>(
      chartData.map((point) => [point.__timestamp, point.__label])
    );
  }, [chartData]);

  const timeSpanMs = useMemo(() => {
    if (chartData.length < 2) return 0;
    const first = chartData[0].__timestamp;
    const last = chartData[chartData.length - 1].__timestamp;
    return Math.abs(Number(last) - Number(first));
  }, [chartData]);

  const formatLabel = useMemo(() => {
    const showDate = timeSpanMs > 24 * 60 * 60 * 1000;
    const options: Intl.DateTimeFormatOptions = showDate
      ? { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
      : { hour: "2-digit", minute: "2-digit" };
    const formatter = new Intl.DateTimeFormat(undefined, options);

    return (value: number | string) => {
      const ts = typeof value === "number" ? value : Number(value);
      const parsedDate = new Date(ts);
      if (!Number.isNaN(parsedDate.getTime())) {
        return formatter.format(parsedDate);
      }

      const label = timestampToLabel.get(value);
      if (label) return label;

      return typeof value === "number" ? `#${value + 1}` : String(value);
    };
  }, [timeSpanMs, timestampToLabel]);

  const hasNoRows = rows.length === 0;
  const hasNoSeries = series.length === 0;

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
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="__timestamp"
                domain={["auto", "auto"]}
                type="number"
                tickFormatter={formatLabel}
                minTickGap={20}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => formatLabel(value)}
                formatter={(value: number) => value}
              />
              {series.map((serie, index) => (
                <Line
                  key={serie.dataKey}
                  type="monotone"
                  dataKey={serie.dataKey}
                  name={
                    serie.name || formatDisplayLabel(serie.dataKey || "value")
                  }
                  stroke={
                    serie.color || COLOR_PALETTE[index % COLOR_PALETTE.length]
                  }
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TimeseriesPanel;
