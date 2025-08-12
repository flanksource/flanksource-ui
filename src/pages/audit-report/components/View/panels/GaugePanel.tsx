import React from "react";
import { PanelResult } from "../../../types";
import { generateGaugeData } from "./utils";

interface GaugePanelProps {
  summary: PanelResult;
}

const GaugePanel: React.FC<GaugePanelProps> = ({ summary }) => {
  return (
    <div>
      {summary.rows
        ?.map((row, rowIndex) => {
          if (!summary.gauge) return null;

          const gaugeData = generateGaugeData(row, summary.gauge);
          const outerArcLength = 204; // π * 65 for outer threshold arc
          const sortedThresholds = summary.gauge.thresholds
            ? [...summary.gauge.thresholds].sort(
                (a, b) => a.percent - b.percent
              )
            : [];

          return (
            <div
              key={`${summary.name}-${rowIndex}`}
              className="w-full rounded-lg border border-gray-200 bg-white p-4"
            >
              <h4 className="mb-1 text-sm font-medium text-gray-600">
                {summary.name}
              </h4>
              {summary.description && (
                <p className="mb-3 text-xs text-gray-500">
                  {summary.description}
                </p>
              )}
              <div className="relative flex h-32 items-center justify-center">
                <svg
                  width="160"
                  height="100"
                  viewBox="0 0 160 80"
                  className="overflow-visible"
                >
                  {/* Outer arc background */}
                  <path
                    d="M 15 70 A 65 65 0 0 1 145 70"
                    stroke="#374151"
                    strokeWidth="8"
                    fill="none"
                    opacity="0.1"
                  />

                  {/* Outer arc - Threshold segments */}
                  {summary.gauge &&
                    summary.gauge.thresholds &&
                    sortedThresholds.map((_, thresholdIndex) => {
                      const currentThreshold = sortedThresholds[thresholdIndex];
                      const nextThreshold =
                        sortedThresholds[thresholdIndex + 1];

                      const startPercentage = currentThreshold.percent;
                      const endPercentage = nextThreshold
                        ? nextThreshold.percent
                        : 100;

                      const startLength =
                        (startPercentage / 100) * outerArcLength;
                      const segmentLength =
                        ((endPercentage - startPercentage) / 100) *
                        outerArcLength;

                      return (
                        <path
                          key={thresholdIndex}
                          d="M 15 70 A 65 65 0 0 1 145 70"
                          stroke={currentThreshold.color}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${segmentLength} ${outerArcLength}`}
                          strokeDashoffset={-startLength}
                          opacity="0.4"
                        />
                      );
                    })}

                  {/* Inner arc background */}
                  <path
                    d="M 25 70 A 55 55 0 0 1 135 70"
                    stroke="#374151"
                    strokeWidth="16"
                    fill="none"
                    opacity="0.05"
                  />

                  {/* Inner arc - Current value (twice as thick) */}
                  <path
                    d="M 25 70 A 55 55 0 0 1 135 70"
                    stroke={gaugeData.color}
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(gaugeData.value / 100) * 173} 173`}
                    className="transition-all duration-700 ease-out"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center pt-4">
                  <div
                    className="text-3xl font-bold"
                    style={{ color: gaugeData.color }}
                  >
                    {gaugeData.originalValue}
                  </div>
                </div>
              </div>
            </div>
          );
        })
        .filter(Boolean)}
    </div>
  );
};

export default GaugePanel;
