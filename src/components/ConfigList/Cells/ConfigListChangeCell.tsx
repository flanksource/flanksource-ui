import { CellContext } from "@tanstack/react-table";
import { useMemo } from "react";
import { ConfigItem } from "../../../api/services/configs";

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

  return (
    <div className="flex flex-col flex-1 w-full max-w-full">
      <div className="flex flex-row max-w-full overflow-hidden">
        <div className="flex max-w-full items-center px-2.5 py-0.5 m-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 overflow-hidden">
          {totalChanges}
        </div>
      </div>
    </div>
  );
}
