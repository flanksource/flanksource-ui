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
import { COLOR_PALETTE, getSeverityOfText, severityToHex } from "./utils";
import PanelWrapper from "./PanelWrapper";

interface PieChartPanelProps {
  summary: PanelResult;
}

/**
 * Transforms raw data rows into pie chart compatible format with intelligent color assignment.
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
      const severity = getSeverityOfText(labelValue);
      const hexColors = severityToHex[severity];
      const colorInGroup = index % hexColors.length;
      fill = hexColors[colorInGroup];
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
    <PanelWrapper
      title={summary.name}
      description={summary.description}
      className="min-h-[300px]"
    >
      <div className="flex flex-1 items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              stroke={chartData.length === 1 ? "none" : undefined}
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
    </PanelWrapper>
  );
};

export default PieChartPanel;
