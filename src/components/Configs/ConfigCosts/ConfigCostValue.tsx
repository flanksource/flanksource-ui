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
  if (
    !config.cost_total_1d ||
    !config.cost_total_7d ||
    !config.cost_total_30d
  ) {
    return null;
  }

  let trend = config.cost_total_1d - config.cost_total_30d / 30;

  let val = (
    <FormatCurrency
      value={config.cost_total_30d}
      defaultValue=""
      hideMinimumValue
    />
  );
  let trendIcon = null;

  if (Math.abs(trend) / (config.cost_total_30d / 30) > 0.1) {
    let percent = (trend / (config.cost_total_30d / 30)) * 100;
    trendIcon = (
      <Percentage value={percent} increaseColor="red" decreaseColor="green" />
    );
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
          cost_total_1d={config.cost_total_1d}
          cost_total_30d={config.cost_total_30d}
          cost_total_7d={config.cost_total_7d}
        />
      </Popover.Panel>
    </Popover>
  );
}
