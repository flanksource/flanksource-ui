import ChangeCountIcon from "@flanksource-ui/ui/Icons/ChangeCount";
import { CellContext } from "@tanstack/react-table";
import { ConfigItem } from "../../../../api/types/configs";

export default function ConfigListChangeCell({
  row,
  column
}: CellContext<ConfigItem, any>) {
  const changes = row?.getValue<ConfigItem["changes"]>(column.id);

  if (!changes) {
    return null;
  }

  return <ChangeCountIcon count={changes} />;
}
