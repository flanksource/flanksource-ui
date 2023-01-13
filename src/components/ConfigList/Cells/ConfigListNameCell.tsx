import { CellContext } from "@tanstack/react-table";
import React from "react";
import { ConfigItem } from "../../../api/services/configs";
import { Badge } from "../../Badge";

function ConfigListNameCell({ row, getValue }: CellContext<ConfigItem, any>) {
  const isDeleted = !!row.original.deleted_at;

  return (
    <div className="flex flex-row space-x-2 items-center">
      <span className="truncate">{getValue()}</span>
      {isDeleted && (
        <Badge text="deleted" colorClass="text-white bg-gray-400" />
      )}
    </div>
  );
}

export default React.memo(ConfigListNameCell);
