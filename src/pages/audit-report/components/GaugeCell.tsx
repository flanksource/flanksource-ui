import React from "react";
import { GaugeConfig } from "../types";
import { generateGaugeData } from "./View/panels/utils";

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
          {gaugeValue} {gaugeConfig?.unit}
        </span>
      </div>
    </div>
  );
};

export default GaugeCell;
