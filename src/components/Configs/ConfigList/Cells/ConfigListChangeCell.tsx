import { CellContext } from "@tanstack/react-table";
import { useMemo } from "react";
import { ConfigItem } from "../../../../api/types/configs";
import ChangeCountIcon from "@flanksource-ui/ui/Icons/ChangeCount";

export default function ConfigListChangeCell({
  row,
  column
}: CellContext<ConfigItem, any>) {
  const changes = row?.getValue<ConfigItem["changes"]>(column.id);
  const totalChanges = useMemo(() => {
    let total = 0;
    (changes || []).forEach((change) => {
      total += change.total || 0;
    });
    return total;
  }, [changes]);

  if (changes == null) {
    return null;
  }

  return <ChangeCountIcon count={totalChanges} />;
}
