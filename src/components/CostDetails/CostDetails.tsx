import { useMemo } from "react";
import { Costs } from "../../api/types/configs";

type FormatCurrencyProps = {
  value: number | string | undefined;
  defaultValue?: string | null | React.ReactNode | number;
  hideMinimumValue?: boolean;
  currency?: string;
};

type CostInfoProps = {
  label: string;
  value: number | string | undefined;
  defaultValue?: string | null | React.ReactNode | number;
  currency?: string;
};

export function FormatCurrency({
  value,
  defaultValue,
  hideMinimumValue,
  currency
}: FormatCurrencyProps) {
  const amount = typeof value === "string" ? Number(value) : value;

  const formatted = useMemo(() => {
    if (!amount || Number.isNaN(amount)) {
      return null;
    }
    // Small amounts are unreadable without cents; on large ones cents are noise.
    const digits = Math.abs(amount) <= 10 ? 2 : 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(amount);
  }, [amount, currency]);

  // Anything that rounds away to zero reads as free, which is worse than showing nothing.
  if (
    !amount ||
    Number.isNaN(amount) ||
    (hideMinimumValue && Math.abs(amount) < 0.005)
  ) {
    return <span>{defaultValue}</span>;
  }

  return <span>{formatted}</span>;
}

export function CostInfo({
  label,
  value,
  defaultValue,
  currency
}: CostInfoProps) {
  return (
    <div className="flex flex-row overflow-hidden">
      <div className="whitespace-nowrap pr-2 text-sm uppercase text-gray-500">
        {label}:
      </div>
      <div className="mr-2 pr-2 text-gray-100">
        <FormatCurrency
          value={value}
          defaultValue={defaultValue}
          currency={currency}
        />
      </div>
    </div>
  );
}

export function CostDetailsTable({
  cost_1h,
  cost_1d,
  cost_30d,
  billing_currency
}: Costs) {
  return (
    <div className="flex flex-row">
      {cost_1h != null && (
        <CostInfo
          value={cost_1h}
          label="1h"
          defaultValue=""
          currency={billing_currency}
        />
      )}
      <CostInfo
        value={cost_1d}
        label="1d"
        defaultValue=""
        currency={billing_currency}
      />
      <CostInfo
        value={cost_30d}
        label="30d"
        defaultValue=""
        currency={billing_currency}
      />
    </div>
  );
}
