import type { Meta, StoryObj } from "@storybook/react";
import GaugePanel from "./GaugePanel";
import { PanelResult } from "../../../types";

const meta: Meta<typeof GaugePanel> = {
  title: "Audit Report/View/Panels/GaugePanel",
  component: GaugePanel,
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicGaugeSummary: PanelResult = {
  name: "Memory Usage",
  type: "gauge",
  description: "Current memory utilization of the system",
  gauge: {
    min: 0,
    max: 100,
    unit: "%",
    thresholds: [
      { percent: 0, color: "#10b981" },
      { percent: 60, color: "#f59e0b" },
      { percent: 80, color: "#ef4444" }
    ]
  },
  rows: [{ value: 75 }]
};

export const MemoryUsage: Story = {
  args: {
    summary: basicGaugeSummary
  }
};

export const LowUsage: Story = {
  args: {
    summary: {
      ...basicGaugeSummary,
      rows: [{ value: 25 }]
    }
  }
};

export const HighUsage: Story = {
  args: {
    summary: {
      ...basicGaugeSummary,
      rows: [{ value: 95 }]
    }
  }
};

export const CPUUsage: Story = {
  args: {
    summary: {
      name: "CPU Usage",
      type: "gauge",
      description: "Current CPU utilization across all cores",
      gauge: {
        min: 0,
        max: 100,
        unit: "%",
        thresholds: [
          { percent: 0, color: "#10b981" },
          { percent: 70, color: "#f59e0b" },
          { percent: 90, color: "#ef4444" }
        ]
      },
      rows: [{ value: 45 }]
    }
  }
};

export const DiskUsage: Story = {
  args: {
    summary: {
      name: "Disk Space",
      type: "gauge",
      description: "Available disk space on primary volume",
      gauge: {
        min: 0,
        max: 500,
        unit: "GB",
        thresholds: [
          { percent: 0, color: "#ef4444" },
          { percent: 100, color: "#f59e0b" },
          { percent: 200, color: "#10b981" }
        ]
      },
      rows: [{ value: 150 }]
    }
  }
};

export const WithoutDescription: Story = {
  args: {
    summary: {
      name: "Network Latency",
      type: "gauge",
      gauge: {
        min: 0,
        max: 100,
        unit: "ms",
        thresholds: [
          { percent: 0, color: "#10b981" },
          { percent: 50, color: "#f59e0b" },
          { percent: 80, color: "#ef4444" }
        ]
      },
      rows: [{ value: 35 }]
    }
  }
};

export const NoThresholds: Story = {
  args: {
    summary: {
      name: "Simple Gauge",
      type: "gauge",
      description: "A gauge without thresholds",
      gauge: {
        min: 0,
        max: 100,
        unit: "%"
      },
      rows: [{ value: 60 }]
    }
  }
};
