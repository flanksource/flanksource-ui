import type { Meta, StoryObj } from "@storybook/react";
import PieChartPanel from "./PieChartPanel";
import { PanelResult } from "../../../types";

const meta: Meta<typeof PieChartPanel> = {
  title: "Audit Report/View/Panels/PieChartPanel",
  component: PieChartPanel,
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const statusDistributionData: PanelResult = {
  name: "Service Status Distribution",
  type: "piechart",
  description: "Distribution of services by health status",
  piechart: {
    showLabels: false
  },
  rows: [
    { status: "healthy", count: 45 },
    { status: "warning", count: 8 },
    { status: "critical", count: 3 },
    { status: "unknown", count: 2 }
  ]
};

export const WithLabels: Story = {
  args: {
    summary: {
      ...statusDistributionData,
      piechart: {
        showLabels: true
      }
    }
  }
};

export const CustomColors: Story = {
  args: {
    summary: {
      name: "Cloud Provider Usage",
      type: "piechart",
      description: "Distribution of resources across cloud providers",
      piechart: {
        showLabels: false,
        colors: {
          AWS: "#FF9900",
          Azure: "#0078D4",
          GCP: "#4285F4",
          "On-Premise": "#6B7280"
        }
      },
      rows: [
        { provider: "AWS", count: 120 },
        { provider: "Azure", count: 85 },
        { provider: "GCP", count: 45 },
        { provider: "On-Premise", count: 30 }
      ]
    }
  }
};

export const SmallDataset: Story = {
  args: {
    summary: {
      name: "Environment Distribution",
      type: "piechart",
      description: "Applications per environment",
      rows: [
        { environment: "Production", count: 15 },
        { environment: "Staging", count: 8 }
      ]
    }
  }
};

export const LargeDataset: Story = {
  args: {
    summary: {
      name: "Technology Stack",
      type: "piechart",
      description: "Programming languages and frameworks used",
      rows: [
        { technology: "React", count: 45 },
        { technology: "Vue.js", count: 32 },
        { technology: "Angular", count: 28 },
        { technology: "Node.js", count: 67 },
        { technology: "Python", count: 54 },
        { technology: "Java", count: 38 },
        { technology: "Go", count: 23 },
        { technology: "PHP", count: 19 },
        { technology: "C#", count: 31 },
        { technology: "Ruby", count: 15 }
      ]
    }
  }
};
