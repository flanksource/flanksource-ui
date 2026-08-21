import type { Meta, StoryObj } from "@storybook/react";
import { CostDetailsTable } from "./CostDetails";

const costs = {
  cost_per_minute: 0.01,
  cost_total_1d: 12,
  cost_total_30d: 360
};

const meta = {
  title: "Configs/Cost Details",
  component: CostDetailsTable,
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof CostDetailsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium shadow-sm">
      <CostDetailsTable {...costs} />
    </div>
  )
};
