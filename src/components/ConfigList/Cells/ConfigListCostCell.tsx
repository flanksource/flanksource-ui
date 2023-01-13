import { CellContext } from "@tanstack/react-table";
import { ConfigItem } from "../../../api/services/configs";
import { FormatCurrency } from "../../ConfigCosts";

export default function ConfigListCostCell({
  getValue
}: CellContext<ConfigItem, any>) {
  const cost = getValue<string | number>();
  if (!cost || parseFloat((cost as number).toFixed(2)) === 0) {
    return null;
  }
  return <FormatCurrency value={cost} />;
}
