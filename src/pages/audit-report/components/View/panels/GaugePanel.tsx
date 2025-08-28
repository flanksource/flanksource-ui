import React from "react";
import GaugeComponent from "react-gauge-component";
import { PanelResult, GaugeThreshold } from "../../../types";

interface GaugePanelProps {
  summary: PanelResult;
}

const GaugePanel: React.FC<GaugePanelProps> = ({ summary }) => {
  if (!summary.rows) return null;

  const gaugeElements = summary.rows
    .map((row, rowIndex) => {
      if (!summary.gauge) return null;

      const value = parseFloat(
        typeof row.value === "number" ? row.value.toFixed(2) : "0"
      );
      const min = summary.gauge.min || 0;
      const max = summary.gauge.max || 100;
      let percentage = 0;
      if (summary.gauge && max !== min) {
        percentage = ((value - min) / (max - min)) * 100;
      }
      let clampedPercentage = parseFloat(
        Math.max(0, Math.min(100, percentage)).toFixed(2)
      );

      const subArcs = summary.gauge?.thresholds
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
      if (summary.gauge?.thresholds) {
        for (const threshold of summary.gauge.thresholds) {
          if (clampedPercentage >= (threshold.percent || 0)) {
            labelColor = threshold.color;
          }
        }
      }

      return (
        <div
          key={`${summary.name}-${rowIndex}`}
          className="flex h-full w-full flex-col rounded-lg border border-gray-200 bg-white p-4"
        >
          <h4 className="mb-1 text-sm font-medium text-gray-600">
            {summary.name}
          </h4>
          {summary.description && (
            <p className="mb-3 text-xs text-gray-500">{summary.description}</p>
          )}
          <GaugeComponent
            value={clampedPercentage}
            pointer={{
              animationDuration: 1000
            }}
            labels={{
              valueLabel: {
                formatTextValue: () => `${value} ${summary.gauge?.unit || ""}`,
                style: {
                  fontWeight: "bold",
                  fill: labelColor,
                  stroke: "none",
                  textShadow: "none"
                }
              },
              tickLabels: {
                type: "outer",
                ticks: [{ value: 100 }],
                defaultTickValueConfig: {
                  formatTextValue: (value: number) => {
                    return `${Math.round((value / 100) * (max - min) + min)}`;
                  },
                  style: { fontSize: 10 }
                }
              }
            }}
            arc={{
              emptyColor: "#ebebeb",
              subArcs: subArcs
            }}
          />
        </div>
      );
    })
    .filter(Boolean);

  return <div>{gaugeElements}</div>;
};

export default GaugePanel;
