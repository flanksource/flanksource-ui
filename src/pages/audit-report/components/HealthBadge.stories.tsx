import type { Meta, StoryObj } from "@storybook/react";
import HealthBadge, { HealthType } from "./HealthBadge";

const meta: Meta<typeof HealthBadge> = {
  title: "Audit Report/Components/HealthBadge",
  component: HealthBadge,
  parameters: {
    layout: "centered"
  },
  argTypes: {
    health: {
      control: "select",
      options: ["healthy", "unhealthy", "warning", "unknown"]
    },
    printView: {
      control: "boolean"
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Healthy: Story = {
  args: {
    health: "healthy"
  }
};

export const Unhealthy: Story = {
  args: {
    health: "unhealthy"
  }
};

export const Warning: Story = {
  args: {
    health: "warning"
  }
};

export const Unknown: Story = {
  args: {
    health: "unknown"
  }
};

export const PrintView: Story = {
  args: {
    health: "unhealthy",
    printView: true
  }
};

export const AllHealthStates: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Standard View</h3>
      <div className="flex gap-2">
        {(["healthy", "unhealthy", "warning", "unknown"] as HealthType[]).map(
          (health) => (
            <HealthBadge key={health} health={health} />
          )
        )}
      </div>
      <h3 className="text-lg font-medium">Print View</h3>
      <div className="flex gap-2">
        {(["healthy", "unhealthy", "warning", "unknown"] as HealthType[]).map(
          (health) => (
            <HealthBadge key={health} health={health} printView />
          )
        )}
      </div>
    </div>
  )
};
