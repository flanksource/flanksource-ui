import { CellContext } from "@tanstack/react-table";
import { ConfigItem } from "../../../api/services/configs";
import { Icon } from "../../Icon";

export default function ConfigListTypeCell({
  row,
  column,
  getValue
}: CellContext<ConfigItem, unknown>) {
  const name = row.getIsGrouped()
    ? row.subRows[0]?.original.external_type
    : row.original.external_type;
  const secondary = row.getIsGrouped()
    ? row.subRows[0]?.original.config_type
    : row.original.config_type;

  return (
    <span className="flex flex-nowrap">
      <Icon name={name} secondary={secondary} />
      <span className="pl-1"> {getValue<ConfigItem["config_type"]>()}</span>
    </span>
  );
}
