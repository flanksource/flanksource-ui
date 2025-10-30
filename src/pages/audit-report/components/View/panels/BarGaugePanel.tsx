import React from "react";
import { PanelResult } from "../../../types";
import { getGaugeColor } from "./utils";

interface BarGaugePanelProps {
  summary: PanelResult;
}

const BarGaugePanel: React.FC<BarGaugePanelProps> = ({ summary }) => {
  if (!summary.rows || summary.rows.length === 0) {
    return null;
  }

  const min = summary.bargauge?.min || 0;
  const max = summary.bargauge?.max || 100;
  const unit = summary.bargauge?.unit || "";
  const thresholds = summary.bargauge?.thresholds;

  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-4">
      <h4 className="mb-2 text-sm font-medium text-gray-600">{summary.name}</h4>
      {summary.description && (
        <p className="mb-3 text-xs text-gray-500">{summary.description}</p>
      )}

      <div className="flex flex-col gap-3">
        {summary.rows.map((row, rowIndex) => {
          // Extract label (similar to TablePanel logic)
          const { value, ...rest } = row;
          const labelKey = Object.keys(rest)[0];
          const labelValue = rest[labelKey] || "Value";

          const numericValue =
            typeof value === "number" ? value : parseFloat(value) || 0;

          // Calculate actual percentage (can exceed 100%)
          let percentage = 0;
          if (max !== min) {
            percentage = ((numericValue - min) / (max - min)) * 100;
          }

          // Clamp percentage for visual bar display (0-100)
          const clampedPercentage = Math.max(0, Math.min(100, percentage));

          // Get color based on clamped percentage
          const color = thresholds
            ? getGaugeColor(clampedPercentage, thresholds)
            : "#10b981"; // Default green

          return (
            <div key={rowIndex} className="flex flex-col gap-1">
              {/* Label and Value Row */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {labelValue}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color }}>
                    {numericValue.toFixed(2)}
                    {unit}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-4 w-full overflow-hidden rounded bg-gray-200">
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
    </div>
  );
};

export default BarGaugePanel;
