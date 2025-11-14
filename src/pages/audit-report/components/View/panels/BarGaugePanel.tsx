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

  const globalMin = summary.bargauge?.min || 0;
  const globalMax = summary.bargauge?.max;
  const globalUnit = summary.bargauge?.unit || "";
  const globalThresholds = summary.bargauge?.thresholds;
  const globalFormat = summary.bargauge?.format; // "percentage", "multiplier", or undefined (raw)

  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-4">
      <h4 className="mb-2 text-sm font-medium text-gray-600">{summary.name}</h4>
      {summary.description && (
        <p className="mb-3 text-xs text-gray-500">{summary.description}</p>
      )}

      <div className="flex flex-col gap-3">
        {summary.rows.map((row, rowIndex) => {
          // Support both new structure (name, value, max) and old structure
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

          // Use row-specific config if available (_bargauge), otherwise use global
          const rowConfig = row._bargauge || {};
          const max =
            rowConfig.max !== undefined
              ? rowConfig.max
              : row.max !== undefined
                ? row.max
                : globalMax || 100;
          const min = globalMin;
          const unit =
            rowConfig.unit !== undefined ? rowConfig.unit : globalUnit;
          const thresholds =
            rowConfig.thresholds || row._thresholds || globalThresholds;
          const format = rowConfig.format || globalFormat;

          // Calculate actual percentage (can exceed 100%)
          let percentage = 0;
          if (max !== min) {
            percentage = ((numericValue - min) / (max - min)) * 100;
          }

          // Clamp percentage for visual bar display only (0-100)
          const clampedPercentage = Math.max(0, Math.min(100, percentage));

          // Get color based on actual percentage (not clamped)
          const color = thresholds
            ? getGaugeColor(percentage, thresholds)
            : "#10b981"; // Default green

          // Format the display value based on the format setting
          let displayValue = "";
          if (format === "percentage") {
            displayValue = `${Math.round(percentage)}%`;
          } else if (format === "multiplier") {
            const multiplier = percentage / 100;
            displayValue = `x${multiplier.toFixed(1)}`;
          } else {
            // Default to raw format (no format specified)
            displayValue = `${numericValue.toFixed(1)}${unit}`;
          }

          return (
            <div key={rowIndex} className="flex flex-col gap-1">
              {/* Label and Value Row */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {labelValue}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color }}>
                    {displayValue}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                className="h-4 w-full overflow-hidden rounded bg-gray-200"
                title={`${Math.round(numericValue)}${unit} / ${Math.round(max)}${unit}`}
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
    </div>
  );
};

export default BarGaugePanel;
