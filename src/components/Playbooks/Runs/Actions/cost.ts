export function formatAICost(cost: number) {
  if (!Number.isFinite(cost) || cost <= 0) {
    return "$0.00";
  }

  if (cost < 0.0001) {
    return "<$0.0001";
  }

  const fractionDigits = cost < 0.01 ? 4 : 2;

  return cost.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });
}

export function formatExactAICost(cost: number) {
  if (!Number.isFinite(cost) || cost <= 0) {
    return "$0";
  }

  const normalizedCost = cost.toFixed(12).replace(/0+$/, "").replace(/\.$/, "");

  return `$${normalizedCost}`;
}
