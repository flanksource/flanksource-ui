import type { Meta, StoryObj } from "@storybook/react";
import TimeseriesPanel from "./TimeseriesPanel";
import { PanelResult } from "../../../types";

const meta: Meta<typeof TimeseriesPanel> = {
  title: "Audit Report/View/Panels/TimeseriesPanel",
  component: TimeseriesPanel,
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const requestVolumeSummary: PanelResult = {
  name: "Request Volume",
  type: "timeseries",
  description: "Success vs failure counts over the last 6 intervals",
  rows: [
    { timestamp: "2024-07-01T00:00:00Z", success: 120, failure: 5 },
    { timestamp: "2024-07-01T01:00:00Z", success: 132, failure: 8 },
    { timestamp: "2024-07-01T02:00:00Z", success: 118, failure: 3 },
    { timestamp: "2024-07-01T03:00:00Z", success: 140, failure: 6 },
    { timestamp: "2024-07-01T04:00:00Z", success: 150, failure: 4 },
    { timestamp: "2024-07-01T05:00:00Z", success: 160, failure: 7 }
  ],
  timeseries: {
    timeKey: "timestamp",
    series: [
      { dataKey: "success", name: "Success" },
      { dataKey: "failure", name: "Failure", color: "#ef4444" }
    ]
  }
};

export const RequestVolume: Story = {
  args: {
    summary: requestVolumeSummary
  }
};

export const AutoDetectedSeries: Story = {
  args: {
    summary: {
      name: "CPU Utilization",
      type: "timeseries",
      description: "Series and timestamp inferred from numeric columns",
      rows: [
        { time: "2024-07-01T00:00:00Z", value: 62.5 },
        { time: "2024-07-01T01:00:00Z", value: 58.1 },
        { time: "2024-07-01T02:00:00Z", value: 65.3 },
        { time: "2024-07-01T03:00:00Z", value: 70.2 },
        { time: "2024-07-01T04:00:00Z", value: 67.8 }
      ]
    }
  }
};
