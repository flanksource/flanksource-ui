import { CellContext } from "@tanstack/react-table";
import { ConfigItem } from "../../../api/services/configs";
import { Icon } from "../../Icon";

export default function ConfigListTypeCell({
  row,
  column,
  getValue
}: CellContext<ConfigItem, unknown>) {
  const name = row.getIsGrouped()
    ? row.subRows[0]?.original.type
    : row.original.type;
  const secondary = row.getIsGrouped()
    ? row.subRows[0]?.original.type
    : row.original.type;

  return (
    <span className="flex flex-nowrap">
      <Icon name={name} secondary={secondary} />
      <span className="pl-1"> {getValue<ConfigItem["type"]>()}</span>
    </span>
  );
}
