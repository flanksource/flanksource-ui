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

  const chartStyle: "lines" | "area" | "points" =
    summary.timeseries?.style || "lines";

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
            <ComposedChart
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
              {series.map((serie, index) =>
                chartStyle === "area" ? (
                  <Area
                    key={serie.dataKey}
                    type="monotone"
                    dataKey={serie.dataKey}
                    name={
                      serie.name || formatDisplayLabel(serie.dataKey || "value")
                    }
                    stroke={
                      serie.color || COLOR_PALETTE[index % COLOR_PALETTE.length]
                    }
                    fill={
                      serie.color || COLOR_PALETTE[index % COLOR_PALETTE.length]
                    }
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
                    fill={
                      serie.color || COLOR_PALETTE[index % COLOR_PALETTE.length]
                    }
                    isAnimationActive={false}
                    line={{ strokeWidth: 0 }}
                  />
                ) : (
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
                )
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TimeseriesPanel;
