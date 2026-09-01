import { CellContext, Row } from "@tanstack/react-table";
import { MRT_Row } from "mantine-react-table";
import {
  ConfigItem,
  ConfigSummary,
  Costs
} from "../../../../api/types/configs";
import ConfigCostValue from "../../ConfigCosts/ConfigCostValue";

export default function ConfigListCostCell({
  row
}: CellContext<ConfigItem, any> | CellContext<ConfigSummary, any>) {
  return <ConfigCostValue config={row.original} popover={false} />;
}
/**
 *
 * Recursively aggregate costs for a given row and its children, and its children's children, etc.
 *
 */
export const aggregatedCosts = (
  rows: Row<ConfigItem> | MRT_Row<ConfigItem>,
  data: Required<Costs>
): Required<Costs> => {
  const subRows = rows.subRows;
  if (!subRows) {
    return data;
  }
  if (subRows.length === 0) {
    return data;
  }
  // @ts-ignore
  return subRows.reduce((acc, row) => {
    if (row.original) {
      acc.cost_30d! += row.original.cost_30d ?? 0;
      acc.cost_1d! += row.original.cost_1d ?? 0;
      acc.cost_1h! += row.original.cost_1h ?? 0;
      acc.cost_per_minute! = row.original.cost_per_minute ?? 0;

      // Totals in different currencies cannot be added. Once a group spans more than one,
      // the sum above is meaningless and the group has to render as mixed instead.
      if (row.original.mixed_currency) {
        acc.mixed_currency = true;
      } else if (row.original.billing_currency) {
        if (!acc.billing_currency) {
          acc.billing_currency = row.original.billing_currency;
        } else if (acc.billing_currency !== row.original.billing_currency) {
          acc.mixed_currency = true;
        }
      }
    }
    return aggregatedCosts(row, acc);
  }, data);
};

export function ConfigListCostAggregate({ row }: CellContext<ConfigItem, any>) {
  const configGroupCosts = aggregatedCosts(row, {
    cost_30d: 0,
    cost_1d: 0,
    cost_1h: 0,
    cost_per_minute: 0,
    billing_currency: "",
    mixed_currency: false
  } as Required<Costs>);
  return <ConfigCostValue config={configGroupCosts} />;
}
