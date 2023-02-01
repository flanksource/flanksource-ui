import { CellContext } from "@tanstack/react-table";
import { ConfigItem } from "../../../api/services/configs";
import { FormatCurrency } from "../../CostDetails/CostDetails";

export default function ConfigListCostCell({
  getValue
}: CellContext<ConfigItem, any>) {
  const cost = getValue<string | number>();
  return <FormatCurrency value={cost} defaultValue="" hideMinimumValue />;
}
