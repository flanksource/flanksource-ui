import { Popover } from "@headlessui/react";
import { Costs } from "../../../api/types/configs";
import Percentage from "../../../ui/stats/Percentage";
import {
  CostDetailsTable,
  FormatCurrency
} from "../../CostDetails/CostDetails";

export default function ConfigCostValue({
  config,
  popover = true
}: {
  config: Costs;
  popover?: boolean;
}) {
  // Spend in several currencies has no single total. Saying so beats an empty cell, which
  // reads as "no cost".
  if (config.mixed_currency) {
    return (
      <span
        className="whitespace-nowrap text-sm text-gray-500"
        title="Spend is recorded in more than one currency, so it cannot be shown as a single total."
      >
        multi-currency
      </span>
    );
  }

  if (!config.cost_30d) {
    return null;
  }

  const val = (
    <FormatCurrency
      value={config.cost_30d}
      defaultValue=""
      hideMinimumValue
      currency={config.billing_currency}
    />
  );

  // The trend compares the last day against the 30-day daily average, so it only means
  // anything once a day of spend has actually landed.
  const dailyAverage = config.cost_30d / 30;
  let trendIcon = null;

  if (config.cost_1d && dailyAverage > 0) {
    const trend = config.cost_1d - dailyAverage;
    if (Math.abs(trend) / dailyAverage > 0.1) {
      const percent = (trend / dailyAverage) * 100;
      trendIcon = (
        <Percentage value={percent} increaseColor="red" decreaseColor="green" />
      );
    }
  }

  if (!popover) {
    return (
      <div className="flex flex-row">
        {val}
        {trendIcon}
      </div>
    );
  }
  return (
    <Popover className="relative">
      <Popover.Button>
        <div className="flex w-full flex-row">
          {val}
          {trendIcon}
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute z-10 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-sm dark:bg-gray-700">
        <CostDetailsTable
          cost_per_minute={config.cost_per_minute}
          cost_1h={config.cost_1h}
          cost_1d={config.cost_1d}
          cost_30d={config.cost_30d}
          billing_currency={config.billing_currency}
        />
      </Popover.Panel>
    </Popover>
  );
}
