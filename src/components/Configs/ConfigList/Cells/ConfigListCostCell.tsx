import { CellContext, Row } from "@tanstack/react-table";
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
const aggregatedCosts = (
  rows: Row<ConfigItem>,
  data: Required<Costs>
): Required<Costs> => {
  if (rows.subRows.length === 0) {
    return data;
  }
  return rows.subRows.reduce((acc, row) => {
    if (row.original) {
      acc.cost_total_30d! += row.original.cost_total_30d ?? 0;
      acc.cost_total_7d! += row.original.cost_total_7d ?? 0;
      acc.cost_total_1d! += row.original.cost_total_1d ?? 0;
      acc.cost_per_minute! = row.original.cost_per_minute ?? 0;
    }
    return aggregatedCosts(row, acc);
  }, data);
};

export function ConfigListCostAggregate({ row }: CellContext<ConfigItem, any>) {
  const configGroupCosts = aggregatedCosts(row, {
    cost_total_30d: 0,
    cost_total_7d: 0,
    cost_total_1d: 0,
    cost_per_minute: 0
  } as Required<Costs>);
  return <ConfigCostValue config={configGroupCosts} />;
}
