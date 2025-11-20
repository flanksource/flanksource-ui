import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { PanelResult } from "../../../types";
import {
  COLOR_PALETTE,
  getStatusColorIndex,
  COLOR_INDEX_TO_HEX
} from "./utils";

interface PieChartPanelProps {
  summary: PanelResult;
}

/**
 * Transforms raw data rows into pie chart compatible format with intelligent color assignment.
 *
 * Color assignment priority:
 * 1. User-provided custom color (if specified in customColors map)
 * 2. Heuristic color based on label/status name (e.g., "error" -> red, "success" -> green)
 * 3. Cycle through default palette as fallback
 *
 * @param rows - Array of data rows containing count and at least one other field for the label
 * @param customColors - Optional map of label values to hex color overrides
 * @returns Array of objects with name, value, and fill color for pie chart rendering
 *
 * @example
 * const data = [
 *   { status: 'success', count: 10 },
 *   { status: 'error', count: 3 }
 * ];
 * generatePieChartData(data); // Returns chart data with heuristic colors
 */
export const generatePieChartData = (
  rows: Record<string, any>[],
  customColors?: Record<string, string>
) => {
  return rows.map((row, index) => {
    const { count, ...rest } = row;
    const labelKey = Object.keys(rest)[0];
    const labelValue = rest[labelKey];

    if (!labelValue) {
      return {
        name: "Unknown",
        value: count,
        fill: COLOR_PALETTE[index % COLOR_PALETTE.length]
      };
    }

    const customColor = customColors?.[labelValue];
    let fill: string;

    if (customColor) {
      fill = customColor;
    } else if (typeof labelValue === "string") {
      const heuristicColorIndex = getStatusColorIndex(labelValue);
      if (heuristicColorIndex !== 0) {
        const hexColors = COLOR_INDEX_TO_HEX[heuristicColorIndex];
        const colorInGroup = index % hexColors.length;
        fill = hexColors[colorInGroup];
      } else {
        fill = COLOR_PALETTE[index % COLOR_PALETTE.length];
      }
    } else {
      fill = COLOR_PALETTE[index % COLOR_PALETTE.length];
    }

    return {
      name: labelValue,
      value: count,
      fill
    };
  });
};

/**
 * Custom legend renderer for the pie chart displaying color indicators with labels.
 * @param props - Recharts legend props containing payload array
 * @returns JSX element rendering the legend
 */
const renderLegend = (props: any) => {
  const { payload } = props;

  return (
    <ul className="mt-1 flex flex-wrap justify-center gap-1 text-xs text-gray-600">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center">
          <span
            className="mr-1 h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

/**
 * Displays data as an interactive pie chart with intelligent color coding.
 *
 * Features:
 * - Automatic semantic coloring (success=green, error=red, etc.)
 * - Support for custom color overrides
 * - Optional value labels on chart slices
 * - Custom legend with color indicators
 *
 * @param props - Component props
 * @param props.summary - Panel data containing rows, title, description, and chart config
 */
const PieChartPanel: React.FC<PieChartPanelProps> = ({ summary }) => {
  const chartData = generatePieChartData(
    summary.rows || [],
    summary.piechart?.colors
  );

  return (
    <div className="flex h-full min-h-[300px] w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
      <h4 className="mb-2 text-sm font-medium text-gray-600">{summary.name}</h4>
      {summary.description && (
        <p className="mb-3 text-xs text-gray-500">{summary.description}</p>
      )}
      <div className="flex flex-1 items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              label={
                summary.piechart?.showLabels === true
                  ? (entry: any) => entry.value
                  : false
              }
            >
              {chartData.map((entry, entryIndex) => (
                <Cell key={`cell-${entryIndex}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip allowEscapeViewBox={{ x: true, y: true }} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartPanel;
