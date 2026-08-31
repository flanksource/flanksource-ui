import type { Meta, StoryObj } from "@storybook/react";
import { CostDetailsTable } from "./CostDetails";

const costs = {
  cost_per_minute: 0.01,
  cost_1h: 0.5,
  cost_1d: 12,
  cost_30d: 360
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

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium shadow-sm">
    {children}
  </div>
);

export const Default: Story = {
  render: () => (
    <Panel>
      <CostDetailsTable {...costs} />
    </Panel>
  )
};

// Costs are only denominated in dollars when the provider bills in dollars.
export const NonDollarCurrency: Story = {
  render: () => (
    <Panel>
      <CostDetailsTable {...costs} billing_currency="EUR" />
    </Panel>
  )
};

// Components carry neither an hourly total nor a currency, so the hourly column has to
// drop out rather than render an empty slot.
export const WithoutHourlyTotal: Story = {
  render: () => (
    <Panel>
      <CostDetailsTable cost_per_minute={0.01} cost_1d={12} cost_30d={360} />
    </Panel>
  )
};

// A day with no recorded spend still has a thirty day total worth showing.
export const NoRecentSpend: Story = {
  render: () => (
    <Panel>
      <CostDetailsTable
        cost_per_minute={0}
        cost_1h={0}
        cost_1d={0}
        cost_30d={76.71}
        billing_currency="USD"
      />
    </Panel>
  )
};
