import { useMemo } from "react";
import { FaDollarSign } from "react-icons/fa";
import Title from "../Title/title";
import CollapsiblePanel from "../CollapsiblePanel";
import { Loading } from "../Loading";

export type CostsData = {
  cost_per_minute?: number;
  cost_total_1d?: number;
  cost_total_7d?: number;
  cost_total_30d?: number;
};

type CostDetailsTableProps = CostsData;

type CostInfoPanelProps = CostsData & {
  loading?: boolean;
  title: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

type FormatCurrencyProps = {
  value: number | string | undefined;
  defaultValue?: string | null | React.ReactNode | number;
  hideMinimumValue?: boolean;
};

type CostInfoProps = {
  label: string;
  value: number | string | undefined;
  defaultValue?: string | null | React.ReactNode | number;
};

function isCostsDataEmpty({
  cost_per_minute,
  cost_total_1d,
  cost_total_7d,
  cost_total_30d
}: CostsData) {
  return (
    cost_per_minute === undefined &&
    cost_total_1d === undefined &&
    cost_total_7d === undefined &&
    cost_total_30d === undefined
  );
}

export function FormatCurrency({
  value,
  defaultValue,
  hideMinimumValue
}: FormatCurrencyProps) {
  const amount = useMemo(() => {
    if (!value) {
      return 0;
    }
    const parsedValue = typeof value === "string" ? parseInt(value) : value;
    if (+value <= 10) {
      return parsedValue.toFixed(2);
    }
    return parsedValue.toFixed(0);
  }, [value]);

  if (
    !value ||
    (parseFloat((value as number).toFixed(2)) === 0 && hideMinimumValue)
  ) {
    return <span>{defaultValue}</span>;
  }

  return <span>${amount}</span>;
}

export function CostInfo({ label, value, defaultValue }: CostInfoProps) {
  return (
    <div className="overflow-hidden flex flex-col flex-1 space-y-2 px-2">
      <div className="text-gray-500 text-sm whitespace-nowrap">{label}</div>
      <div className="text-black text-sm font-semibold">
        <FormatCurrency value={value} defaultValue={defaultValue} />
      </div>
    </div>
  );
}

export function CostDetailsTable({
  cost_per_minute,
  cost_total_1d,
  cost_total_7d,
  cost_total_30d
}: CostDetailsTableProps) {
  return (
    <div className="flex flex-row justify-between space-x-3 w-full px-2">
      <CostInfo value={cost_per_minute} label="Per min" defaultValue="" />
      <CostInfo value={cost_total_1d} label="1d" defaultValue="" />
      <CostInfo value={cost_total_7d} label="7d" defaultValue="" />
      <CostInfo value={cost_total_30d} label="30d" defaultValue="" />
    </div>
  );
}

export function CostInfoPanel({
  title,
  loading,
  isCollapsed,
  onCollapsedStateChange,
  ...costDetails
}: CostInfoPanelProps) {
  if (isCostsDataEmpty({ ...costDetails })) {
    return null;
  }

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <Title title={title} icon={<FaDollarSign className="w-6 h-auto" />} />
      }
      data-panel-height="150px"
    >
      <div className="flex flex-col space-y-2">
        {loading ? <Loading /> : <CostDetailsTable {...costDetails} />}
      </div>
    </CollapsiblePanel>
  );
}
