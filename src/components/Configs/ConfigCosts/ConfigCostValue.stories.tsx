import type { Meta, StoryObj } from "@storybook/react";
import ConfigCostValue from "./ConfigCostValue";

const meta = {
  title: "Configs/Config Cost Value",
  component: ConfigCostValue,
  parameters: {
    layout: "centered"
  }
} satisfies Meta<typeof ConfigCostValue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    config: {
      cost_per_minute: 0.01,
      cost_total_1h: 0.5,
      cost_total_1d: 12,
      cost_total_30d: 360,
      billing_currency: "USD"
    },
    popover: false
  }
};

// A day well above the thirty day average earns a trend marker.
export const Trending: Story = {
  args: {
    config: {
      cost_total_1h: 1.2,
      cost_total_1d: 24,
      cost_total_30d: 360,
      billing_currency: "USD"
    },
    popover: false
  }
};

export const NonDollarCurrency: Story = {
  args: {
    config: {
      cost_total_1d: 12,
      cost_total_30d: 360,
      billing_currency: "EUR"
    },
    popover: false
  }
};

// Spend across several currencies has no single total, so the totals arrive null. Saying
// so is the point: an empty cell would read as "this costs nothing".
export const MixedCurrency: Story = {
  args: {
    config: {
      mixed_currency: true
    },
    popover: false
  }
};

// The thirty day total still shows when the most recent day recorded no spend, which is
// the normal state for a provider that reports a day or more in arrears.
export const NoRecentSpend: Story = {
  args: {
    config: {
      cost_total_1h: 0,
      cost_total_1d: 0,
      cost_total_30d: 76.71,
      billing_currency: "USD"
    },
    popover: false
  }
};
