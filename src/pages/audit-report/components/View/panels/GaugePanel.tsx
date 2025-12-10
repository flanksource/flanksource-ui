import React, { useRef, useState, useEffect } from "react";
import GaugeComponent, { SubArc } from "react-gauge-component";
import { PanelResult, GaugeThreshold } from "../../../types";
import { formatDisplayValue } from "./utils";

interface GaugePanelProps {
  summary: PanelResult;
}

interface GaugeItemProps {
  summary: PanelResult;
  row: { value?: string | number; count?: string | number; label?: string };
  rowIndex: number;
}

const GaugeItem: React.FC<GaugeItemProps> = ({ summary, row, rowIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const { width, height } = container.getBoundingClientRect();
      setDimensions({ width, height });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

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

  const clampedPercentage = Number.isFinite(percentage)
    ? parseFloat(Math.max(0, Math.min(100, percentage)).toFixed(2))
    : 0;

  const subArcs: SubArc[] = !hasMax
    ? [{ color: "#d1d5db" }]
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

  // Calculate gauge size based on container dimensions
  // The grafana gauge has roughly a 2:1 width:height aspect ratio
  let gaugeWidth = 100;
  if (dimensions) {
    const aspectRatio = 2;
    const maxWidthFromHeight = dimensions.height * aspectRatio;
    gaugeWidth = Math.min(dimensions.width, maxWidthFromHeight);
  }

  return (
    <div
      key={`${summary.name}-${rowIndex}`}
      className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4"
    >
      <h4 className="mb-1 text-sm font-medium text-gray-600">{summary.name}</h4>
      {summary.description && (
        <p className="mb-3 text-xs text-gray-500">{summary.description}</p>
      )}
      <div
        ref={containerRef}
        className="flex flex-1 items-center justify-center overflow-hidden"
      >
        {dimensions && (
          <GaugeComponent
            style={{ width: gaugeWidth }}
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
        )}
      </div>
    </div>
  );
};

const GaugePanel: React.FC<GaugePanelProps> = ({ summary }) => {
  if (!summary.rows) return null;

  const gaugeElements = summary.rows
    .map((row, rowIndex) => {
      if (!summary.gauge) return null;
      return (
        <GaugeItem
          key={`${summary.name}-${rowIndex}`}
          summary={summary}
          row={row}
          rowIndex={rowIndex}
        />
      );
    })
    .filter(Boolean);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{gaugeElements}</>;
};

export default GaugePanel;
