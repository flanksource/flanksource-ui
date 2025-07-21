import type { Meta, StoryObj } from "@storybook/react";
import TextPanel from "./TextPanel";
import { PanelResult } from "../../../types";

const meta: Meta<typeof TextPanel> = {
  title: "Audit Report/View/Panels/TextPanel",
  component: TextPanel,
  parameters: {
    layout: "centered"
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicTextSummary: PanelResult = {
  name: "System Status",
  type: "text",
  description: "Current overall system status",
  rows: [{ value: "All systems operational. No issues detected." }]
};

export const SystemStatus: Story = {
  args: {
    summary: basicTextSummary
  }
};

export const ErrorMessage: Story = {
  args: {
    summary: {
      name: "Recent Alert",
      type: "text",
      description: "Latest system alert message",
      rows: [
        {
          value:
            "WARNING: High memory usage detected on production server. Consider scaling up resources."
        }
      ]
    }
  }
};

export const LongText: Story = {
  args: {
    summary: {
      name: "Deployment Notes",
      type: "text",
      description: "Notes from the latest deployment",
      rows: [
        {
          value:
            "Deployed version 2.1.4 successfully at 14:30 UTC. This release includes bug fixes for the authentication module, performance improvements in the data processing pipeline, and updated security configurations. All smoke tests passed. Rolling deployment completed across 3 availability zones with zero downtime."
        }
      ]
    }
  }
};

export const Configuration: Story = {
  args: {
    summary: {
      name: "Active Configuration",
      type: "text",
      description: "Current environment configuration",
      rows: [
        {
          value:
            "Environment: Production\nRegion: us-east-1\nLoad Balancer: ALB-PROD-001\nDatabase: RDS Aurora Cluster\nCache: ElastiCache Redis 6.2"
        }
      ]
    }
  }
};

export const WithoutDescription: Story = {
  args: {
    summary: {
      name: "Quick Note",
      type: "text",
      rows: [
        {
          value: "Maintenance window scheduled for Sunday 2:00 AM - 4:00 AM UTC"
        }
      ]
    }
  }
};

export const MultipleRows: Story = {
  args: {
    summary: {
      name: "Multiple Messages",
      type: "text",
      description: "Recent system messages",
      rows: [
        { value: "System backup completed successfully at 02:00 UTC" },
        { value: "Security scan completed - no vulnerabilities found" },
        {
          value:
            "Performance monitoring active - all metrics within normal ranges"
        }
      ]
    }
  }
};

export const JSONData: Story = {
  args: {
    summary: {
      name: "Configuration Data",
      type: "text",
      description: "Current system configuration in JSON format",
      rows: [
        {
          value: `{\n  "version": "2.1.4",\n  "environment": "production",\n  "features": {\n    "authentication": true,\n    "monitoring": true,\n    "logging": true\n  },\n  "limits": {\n    "maxUsers": 10000,\n    "requestRate": "1000/min"\n  }\n}`
        }
      ]
    }
  }
};
