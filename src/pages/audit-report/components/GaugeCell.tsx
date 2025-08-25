import React from "react";
import { GaugeConfig } from "../types";
import { generateGaugeData } from "./View/panels/utils";
import { formatBytes } from "../../../utils/common";
import { Tooltip } from "react-tooltip";

interface GaugeCellProps {
  value: number | { min: number; max: number; value: number };
  gauge?: GaugeConfig;
}

const GaugeCell: React.FC<GaugeCellProps> = ({ value, gauge }) => {
  const gaugeValue = typeof value === "number" ? value : value.value;
  const gaugeConfig =
    typeof value === "number"
      ? gauge
      : { ...gauge, min: value.min, max: value.max };

  const gaugeData = generateGaugeData({ value: gaugeValue }, gaugeConfig);
  const percentage = gaugeData.value;
  const color = gaugeData.color;

  // Format display value based on unit
  const formatDisplayValue = (value: number, unit?: string): string => {
    if (!unit) return value.toString();

    switch (unit) {
      case "bytes":
        return formatBytes(value);
      case "millicores":
      case "millicore":
        if (value === 0) return "";
        if (value > 0 && value < 1) return `1m`;
        return `${Math.round(value)}m`;
      default:
        return `${value} ${unit}`;
    }
  };

  const displayValue = formatDisplayValue(gaugeValue, gaugeConfig?.unit);
  const maxValue = gaugeConfig?.max;
  const maxDisplayValue = maxValue
    ? formatDisplayValue(maxValue, gaugeConfig?.unit)
    : undefined;

  const tooltipId = `gauge-tooltip-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div
      className="flex w-full items-center gap-2"
      data-tooltip-id={maxDisplayValue ? tooltipId : undefined}
      data-tooltip-html={
        maxDisplayValue
          ? `${percentage.toFixed(2)}% of ${maxDisplayValue}`
          : undefined
      }
    >
      {/* Progress bar */}
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>

      {/* Value text */}
      <span className="min-w-fit text-xs font-medium text-gray-700">
        {displayValue}
      </span>

      {maxDisplayValue && <Tooltip id={tooltipId} style={{ zIndex: 9999 }} />}
    </div>
  );
};

export default GaugeCell;
