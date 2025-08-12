import React from "react";
import { GaugeConfig } from "../types";
import { generateGaugeData } from "./View/panels/utils";
import { formatBytes } from "../../../utils/common";

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
        // Use the same logic as formatMillicore function in DynamicDataTable
        if (value >= 1000) {
          return `${(value / 1000).toFixed(2)} cores`;
        }
        return `${value}m`;
      default:
        return `${value} ${unit}`;
    }
  };

  const displayValue = formatDisplayValue(gaugeValue, gaugeConfig?.unit);

  return (
    <div className="flex items-center gap-2">
      <div className="flex w-20 items-center gap-2">
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
      </div>
    </div>
  );
};

export default GaugeCell;
