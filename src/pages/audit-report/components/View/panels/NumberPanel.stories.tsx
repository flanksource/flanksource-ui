import type { Meta, StoryObj } from "@storybook/react";
import NumberPanel from "./NumberPanel";
import { PanelResult } from "../../../types";

const meta: Meta<typeof NumberPanel> = {
  title: "Audit Report/View/Panels/NumberPanel",
  component: NumberPanel,
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicNumberSummary: PanelResult = {
  name: "Total Users",
  type: "number",
  description: "Active users in the system",
  number: {
    unit: "",
    precision: 0
  },
  rows: [{ value: 1245 }]
};

export const TotalUsers: Story = {
  args: {
    summary: basicNumberSummary
  }
};

export const Revenue: Story = {
  args: {
    summary: {
      name: "Monthly Revenue",
      type: "number",
      description: "Total revenue for the current month",
      number: {
        unit: "$",
        precision: 2
      },
      rows: [{ value: 45672.89 }]
    }
  }
};

export const Uptime: Story = {
  args: {
    summary: {
      name: "System Uptime",
      type: "number",
      description: "Percentage uptime over the last 30 days",
      number: {
        unit: "%",
        precision: 2
      },
      rows: [{ value: 99.95 }]
    }
  }
};

export const ResponseTime: Story = {
  args: {
    summary: {
      name: "Avg Response Time",
      type: "number",
      description: "Average API response time",
      number: {
        unit: "ms",
        precision: 1
      },
      rows: [{ value: 234.7 }]
    }
  }
};

export const ErrorCount: Story = {
  args: {
    summary: {
      name: "Error Count",
      type: "number",
      description: "Number of errors in the last hour",
      number: {
        unit: "errors",
        precision: 0
      },
      rows: [{ value: 12 }]
    }
  }
};

export const WithoutUnit: Story = {
  args: {
    summary: {
      name: "Active Sessions",
      type: "number",
      description: "Currently active user sessions",
      number: {
        unit: "",
        precision: 0
      },
      rows: [{ value: 847 }]
    }
  }
};

export const WithoutDescription: Story = {
  args: {
    summary: {
      name: "Downloads",
      type: "number",
      number: {
        unit: "",
        precision: 0
      },
      rows: [{ value: 15643 }]
    }
  }
};

export const EmptyRows: Story = {
  args: {
    summary: {
      name: "No Data",
      type: "number",
      description: "Panel with no data",
      number: {
        unit: "",
        precision: 0
      },
      rows: []
    }
  }
};
