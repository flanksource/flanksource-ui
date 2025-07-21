import type { Meta, StoryObj } from "@storybook/react";
import GaugeCell from "./GaugeCell";
import { GaugeConfig } from "../types";

const meta: Meta<typeof GaugeCell> = {
  title: "Audit Report/Components/GaugeCell",
  component: GaugeCell,
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicGaugeConfig: GaugeConfig = {
  min: 0,
  max: 100,
  unit: "%",
  thresholds: [
    { value: 80, color: "#ef4444" },
    { value: 60, color: "#f59e0b" },
    { value: 0, color: "#10b981" }
  ]
};

export const BasicGauge: Story = {
  args: {
    value: 75,
    gauge: basicGaugeConfig
  }
};

export const LowValue: Story = {
  args: {
    value: 25,
    gauge: basicGaugeConfig
  }
};

export const HighValue: Story = {
  args: {
    value: 90,
    gauge: basicGaugeConfig
  }
};

export const WithObjectValue: Story = {
  args: {
    value: { min: 0, max: 200, value: 150 },
    gauge: {
      min: 0,
      max: 200,
      unit: "MB",
      thresholds: [
        { value: 160, color: "#ef4444" },
        { value: 120, color: "#f59e0b" },
        { value: 0, color: "#10b981" }
      ]
    }
  }
};

export const MemoryUsage: Story = {
  args: {
    value: 1.2,
    gauge: {
      min: 0,
      max: 2,
      unit: "GB",
      thresholds: [
        { value: 1.8, color: "#ef4444" },
        { value: 1.5, color: "#f59e0b" },
        { value: 0, color: "#10b981" }
      ]
    }
  }
};

export const CPUUsage: Story = {
  args: {
    value: 85,
    gauge: {
      min: 0,
      max: 100,
      unit: "%",
      thresholds: [
        { value: 90, color: "#ef4444" },
        { value: 70, color: "#f59e0b" },
        { value: 0, color: "#10b981" }
      ]
    }
  }
};

export const WithoutThresholds: Story = {
  args: {
    value: 50,
    gauge: {
      min: 0,
      max: 100,
      unit: "%"
    }
  }
};
