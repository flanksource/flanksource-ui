import type { Meta, StoryObj } from "@storybook/react";
import StatusBadge from "./StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "Audit Report/Components/StatusBadge",
  component: StatusBadge,
  parameters: {
    layout: "centered"
  },
  argTypes: {
    status: {
      control: "text"
    },
    printView: {
      control: "boolean"
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    status: "pending"
  }
};

export const InProgress: Story = {
  args: {
    status: "in-progress"
  }
};

export const Investigating: Story = {
  args: {
    status: "investigating"
  }
};

export const Critical: Story = {
  args: {
    status: "critical"
  }
};

export const High: Story = {
  args: {
    status: "high"
  }
};

export const Medium: Story = {
  args: {
    status: "medium"
  }
};

export const Low: Story = {
  args: {
    status: "low"
  }
};

export const Success: Story = {
  args: {
    status: "success"
  }
};

export const Failed: Story = {
  args: {
    status: "failed"
  }
};

export const Warning: Story = {
  args: {
    status: "warning"
  }
};

export const CustomStatus: Story = {
  args: {
    status: "custom-status"
  }
};

export const PrintView: Story = {
  args: {
    status: "critical",
    printView: true
  }
};

export const AllStatuses: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Standard View</h3>
      <div className="flex flex-wrap gap-2">
        {[
          "pending",
          "in-progress",
          "investigating",
          "critical",
          "high",
          "medium",
          "low",
          "success",
          "failed",
          "warning",
          "resolved"
        ].map((status) => (
          <StatusBadge key={status} status={status} />
        ))}
      </div>
      <h3 className="text-lg font-medium">Print View</h3>
      <div className="flex flex-wrap gap-2">
        {[
          "pending",
          "in-progress",
          "investigating",
          "critical",
          "high",
          "medium",
          "low",
          "success",
          "failed",
          "warning",
          "resolved"
        ].map((status) => (
          <StatusBadge key={status} status={status} printView />
        ))}
      </div>
    </div>
  )
};
