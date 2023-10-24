import { CellContext } from "@tanstack/react-table";
import { ConfigItem, ConfigSummary } from "../../../api/types/configs";
import { FormatCurrency } from "../../CostDetails/CostDetails";

export default function ConfigListCostCell({
  getValue
}: CellContext<ConfigItem, any> | CellContext<ConfigSummary, any>) {
  const cost = getValue<string | number>();
  return (
    <div className="w-full text-center">
      <FormatCurrency value={cost} defaultValue="" hideMinimumValue />
    </div>
  );
}
