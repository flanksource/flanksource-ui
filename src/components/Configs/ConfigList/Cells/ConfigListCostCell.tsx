import { CellContext } from "@tanstack/react-table";
import { ConfigItem, ConfigSummary } from "../../../../api/types/configs";
import ConfigCostValue from "../../ConfigCosts/ConfigCostValue";

export default function ConfigListCostCell({
  getValue,
  row
}: CellContext<ConfigItem, any> | CellContext<ConfigSummary, any>) {
  return <ConfigCostValue config={row.original} popover={false} />;
}
