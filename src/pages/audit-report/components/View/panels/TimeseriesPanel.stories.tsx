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
    { timestamp: "2024-07-01T00:00:00Z", result: "success", value: 120 },
    { timestamp: "2024-07-01T00:00:00Z", result: "failure", value: 5 },
    { timestamp: "2024-07-01T01:00:00Z", result: "success", value: 132 },
    { timestamp: "2024-07-01T01:00:00Z", result: "failure", value: 8 },
    { timestamp: "2024-07-01T02:00:00Z", result: "success", value: 118 },
    { timestamp: "2024-07-01T02:00:00Z", result: "failure", value: 3 },
    { timestamp: "2024-07-01T03:00:00Z", result: "success", value: 140 },
    { timestamp: "2024-07-01T03:00:00Z", result: "failure", value: 6 },
    { timestamp: "2024-07-01T04:00:00Z", result: "success", value: 150 },
    { timestamp: "2024-07-01T04:00:00Z", result: "failure", value: 4 },
    { timestamp: "2024-07-01T05:00:00Z", result: "success", value: 160 },
    { timestamp: "2024-07-01T05:00:00Z", result: "failure", value: 7 }
  ],
  timeseries: {
    timeKey: "timestamp",
    valueKey: "value"
  }
};

export const RequestVolume: Story = {
  args: {
    summary: requestVolumeSummary
  }
};

export const InferredSeriesFromLabels: Story = {
  args: {
    summary: {
      name: "CPU Utilization",
      type: "timeseries",
      description: "Series inferred from kind labels; time/value keys provided",
      rows: [
        { time: "2024-07-01T00:00:00Z", kind: "Deployment", value: 62.5 },
        { time: "2024-07-01T00:00:00Z", kind: "Pod", value: 10.1 },
        { time: "2024-07-01T01:00:00Z", kind: "Deployment", value: 58.1 },
        { time: "2024-07-01T01:00:00Z", kind: "Pod", value: 11.4 },
        { time: "2024-07-01T02:00:00Z", kind: "Deployment", value: 65.3 },
        { time: "2024-07-01T02:00:00Z", kind: "Pod", value: 9.6 },
        { time: "2024-07-01T03:00:00Z", kind: "Deployment", value: 70.2 },
        { time: "2024-07-01T04:00:00Z", kind: "Deployment", value: 67.8 }
      ],
      // time/value keys are provided; series are inferred from the "kind" label
      timeseries: {
        timeKey: "time",
        valueKey: "value"
      }
    }
  }
};
