import { useMemo } from "react";
import { CostsData } from "../../api/types/common";

type CostDetailsTableProps = CostsData;

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
    <div className="flex flex-row overflow-hidden">
      <div className="whitespace-nowrap pr-2 text-sm uppercase text-gray-500">
        {label}:
      </div>
      <div className="mr-2 pr-2 text-gray-100">
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
    <div className="flex flex-row">
      <CostInfo value={cost_total_1d} label="1d" defaultValue="" />
      <CostInfo value={cost_total_7d} label="7d" defaultValue="" />
      <CostInfo value={cost_total_30d} label="30d" defaultValue="" />
    </div>
  );
}
