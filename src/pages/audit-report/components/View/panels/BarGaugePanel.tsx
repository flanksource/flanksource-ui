import React from "react";
import { PanelResult, BarGaugeConfig } from "../../../types";
import { getGaugeColor, formatDisplayValue } from "./utils";
import PanelWrapper from "./PanelWrapper";

interface BarGaugePanelProps {
  summary: PanelResult;
}

interface RowConfig {
  max: number;
  min: number;
  unit: string;
  thresholds: any;
  format: "percentage" | "multiplier" | undefined;
  precision: number;
}

const getRowConfig = (row: any, globalConfig: BarGaugeConfig): RowConfig => {
  const rowBargauge = row._bargauge || {};

  return {
    max: rowBargauge.max ?? row.max ?? globalConfig.max ?? 100,
    min: globalConfig.min || 0,
    unit: (rowBargauge.unit ?? globalConfig.unit) || "",
    thresholds:
      rowBargauge.thresholds || row._thresholds || globalConfig.thresholds,
    format: rowBargauge.format || globalConfig.format,
    precision: rowBargauge.precision ?? globalConfig.precision ?? 0
  };
};

const formatBarGaugeValue = (
  numericValue: number,
  percentage: number,
  format: string | undefined,
  unit: string,
  precision: number
): string => {
  if (format === "percentage") {
    return `${Math.round(percentage)}%`;
  }
  if (format === "multiplier") {
    return `x${(percentage / 100).toFixed(Math.max(precision, 1))}`;
  }
  return formatDisplayValue(numericValue, unit || undefined, precision);
};

const BarGaugePanel: React.FC<BarGaugePanelProps> = ({ summary }) => {
  if (!summary.rows || summary.rows.length === 0) {
    return null;
  }

  const globalConfig: BarGaugeConfig = {
    min: summary.bargauge?.min ?? 0,
    max: summary.bargauge?.max ?? 100,
    unit: summary.bargauge?.unit ?? "",
    thresholds: summary.bargauge?.thresholds,
    format: summary.bargauge?.format,
    precision: summary.bargauge?.precision
  };

  return (
    <PanelWrapper title={summary.name} description={summary.description}>
      <div className="flex flex-col gap-3">
        {summary.rows.map((row, rowIndex) => {
          const labelValue =
            row.name ||
            (() => {
              const { value, ...rest } = row;
              const labelKey = Object.keys(rest)[0];
              return rest[labelKey] || "Value";
            })();

          const numericValue =
            typeof row.value === "number"
              ? row.value
              : parseFloat(row.value) || 0;

          const config = getRowConfig(row, globalConfig);
          const percentage =
            config.max !== config.min
              ? ((numericValue - config.min) / (config.max - config.min)) * 100
              : 0;

          const clampedPercentage = Math.max(0, Math.min(100, percentage));
          const color = config.thresholds
            ? getGaugeColor(percentage, config.thresholds)
            : "#10b981";

          const displayValue = formatBarGaugeValue(
            numericValue,
            percentage,
            config.format,
            config.unit,
            config.precision
          );

          return (
            <div key={rowIndex} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {labelValue}
                </span>
                <span className="text-sm font-bold" style={{ color }}>
                  {displayValue}
                </span>
              </div>

              <div
                className="h-2.5 w-full overflow-hidden rounded bg-gray-200"
                title={`${Math.round(numericValue)}${config.unit} / ${Math.round(config.max)}${config.unit}`}
              >
                <div
                  className="h-full rounded transition-all duration-500 ease-out"
                  style={{
                    width: `${clampedPercentage}%`,
                    backgroundColor: color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </PanelWrapper>
  );
};

export default BarGaugePanel;
