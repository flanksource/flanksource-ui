import type { Meta, StoryObj } from "@storybook/react";
import TablePanel from "./TablePanel";
import { PanelResult } from "../../../types";

const meta: Meta<typeof TablePanel> = {
  title: "Audit Report/View/Panels/TablePanel",
  component: TablePanel,
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicTableSummary: PanelResult = {
  name: "Service Metrics",
  type: "table",
  rows: [
    { service: "API Gateway", value: "99.9%" },
    { service: "Database", value: "99.5%" },
    { service: "Cache", value: "99.8%" },
    { service: "Load Balancer", value: "100%" }
  ]
};

export const ServiceMetrics: Story = {
  args: {
    summary: basicTableSummary
  }
};

export const SingleRow: Story = {
  args: {
    summary: {
      name: "Single Metric",
      type: "table",
      rows: [{ metric: "System Health", value: "Excellent" }]
    }
  }
};

export const LongLabels: Story = {
  args: {
    summary: {
      name: "Complex Metrics",
      type: "table",
      rows: [
        { component: "Database Connection Pool Manager", value: "Healthy" },
        { component: "Background Job Processing Engine", value: "Processing" },
        { component: "Real-time Analytics Data Pipeline", value: "Active" }
      ]
    }
  }
};
