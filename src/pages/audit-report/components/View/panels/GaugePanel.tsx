import React from "react";
import GaugeComponent, { SubArc } from "react-gauge-component";
import { PanelResult, GaugeThreshold } from "../../../types";
import { formatDisplayValue } from "./utils";

interface GaugePanelProps {
  summary: PanelResult;
}

const GaugePanel: React.FC<GaugePanelProps> = ({ summary }) => {
  if (!summary.rows) return null;

  const gaugeElements = summary.rows
    .map((row, rowIndex) => {
      if (!summary.gauge) return null;

      const value = Number(row.value);
      const safeValue = Number.isFinite(value) ? value : 0;
      const min = Number(summary.gauge.min || 0);
      const max = Number(summary.gauge.max || 0);
      const hasMax = summary.gauge.max != null;

      let percentage = 0;
      if (hasMax && max !== min) {
        percentage = ((safeValue - min) / (max - min)) * 100;
      }

      // Handle edge cases where value is outside min/max or percentage is NaN
      const clampedPercentage = Number.isFinite(percentage)
        ? parseFloat(Math.max(0, Math.min(100, percentage)).toFixed(2))
        : 0;

      const subArcs: SubArc[] = !hasMax
        ? [{ color: "#d1d5db" }] // Simplified arc for gauges without max value
        : summary.gauge?.thresholds
          ? summary.gauge.thresholds.map(
              (threshold: GaugeThreshold, i: number) => ({
                limit:
                  i === (summary.gauge?.thresholds?.length ?? 0) - 1
                    ? 100
                    : (summary.gauge?.thresholds?.[i + 1]?.percent ?? 100),
                color: threshold.color,
                showTick: true
              })
            )
          : [{ limit: 100, color: "teal", showTick: false }];

      let labelColor = "black";
      if (hasMax && summary.gauge?.thresholds) {
        for (const threshold of summary.gauge.thresholds) {
          if (clampedPercentage >= (threshold.percent || 0)) {
            labelColor = threshold.color;
          }
        }
      }

      return (
        <div
          key={`${summary.name}-${rowIndex}`}
          className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4"
        >
          <h4 className="mb-1 text-sm font-medium text-gray-600">
            {summary.name}
          </h4>
          {summary.description && (
            <p className="mb-3 text-xs text-gray-500">{summary.description}</p>
          )}
          <div className="flex flex-1 items-center justify-center overflow-hidden">
            <GaugeComponent
              value={clampedPercentage}
              pointer={{
                animationDuration: 1000
              }}
              labels={{
                valueLabel: {
                  formatTextValue: () =>
                    formatDisplayValue(value, summary.gauge?.unit),
                  style: {
                    fontWeight: "bold",
                    fill: labelColor,
                    stroke: "none",
                    textShadow: "none"
                  }
                },
                tickLabels: (() => {
                  if (!hasMax) {
                    // Only show simplified ticks when max is not defined
                    return {
                      type: "outer",
                      hideMinMax: true
                    };
                  }

                  return {
                    type: "outer",
                    ticks: summary.gauge?.thresholds
                      ? summary.gauge.thresholds.map((t) => ({
                          value: t.percent
                        }))
                      : [{ value: 100 }],
                    defaultTickValueConfig: {
                      formatTextValue: (value: number) => {
                        const actualValue = (value / 100) * (max - min) + min;
                        return formatDisplayValue(
                          actualValue,
                          summary.gauge?.unit
                        );
                      },
                      style: { fontSize: 10 }
                    }
                  };
                })()
              }}
              arc={{
                emptyColor: "#ebebeb",
                subArcs: subArcs
              }}
            />
          </div>
        </div>
      );
    })
    .filter(Boolean);

  return <div>{gaugeElements}</div>;
};

export default GaugePanel;
