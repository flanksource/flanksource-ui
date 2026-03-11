import React, { useMemo } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { PanelResult } from "../../../types";
import PanelHeader from "./PanelHeader";
import { COLOR_PALETTE, getSeverityOfText, severityToHex } from "./utils";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@flanksource-ui/components/ui/chart";

interface PieChartPanelProps {
  summary: PanelResult;
}

/**
 * Transforms raw data rows into pie chart compatible format with intelligent color assignment.
 */
export const generatePieChartData = (
  rows: Record<string, any>[],
  customColors?: Record<string, string>,
  maxSlices = 6
) => {
  const entries = rows.map((row, index) => {
    const { count, ...rest } = row;
    const labelKey = Object.keys(rest)[0];
    const labelValue = rest[labelKey];
    const parsedValue = Number(count);
    const value = Number.isFinite(parsedValue) ? parsedValue : 0;
    const name = labelValue ? String(labelValue) : "Unknown";
    const customColor = customColors?.[name];
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
      name,
      value,
      fill
    };
  });

  if (entries.length <= maxSlices) {
    return entries;
  }

  const sorted = [...entries].sort((a, b) => b.value - a.value);
  const keep = sorted.slice(0, Math.max(maxSlices - 1, 1));
  const overflow = sorted.slice(keep.length);
  const overflowValue = overflow.reduce((sum, item) => sum + item.value, 0);

  const othersFill =
    customColors?.others || COLOR_PALETTE[keep.length % COLOR_PALETTE.length];

  return [
    ...keep,
    {
      name: "others",
      value: overflowValue,
      fill: othersFill
    }
  ];
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
  const chartData = useMemo(() => {
    return generatePieChartData(summary.rows || [], summary.piechart?.colors);
  }, [summary.rows, summary.piechart?.colors]);

  const chartConfig = useMemo<ChartConfig>(() => {
    return chartData.reduce<ChartConfig>((acc, item) => {
      acc[item.name] = { label: item.name, color: item.fill };
      return acc;
    }, {});
  }, [chartData]);

  return (
    <div className="flex h-full min-h-[300px] w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
      <PanelHeader title={summary.name} description={summary.description} />
      <div className="flex flex-1 items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="flex h-full min-h-[240px] w-full flex-1 items-center justify-center"
        >
          <PieChart margin={{ top: 8, right: 80, bottom: 8, left: 8 }}>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
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
            <ChartLegend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              content={
                <ChartLegendContent
                  nameKey="name"
                  className="!w-auto !flex-col !items-start !gap-2 !pt-0"
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default PieChartPanel;
