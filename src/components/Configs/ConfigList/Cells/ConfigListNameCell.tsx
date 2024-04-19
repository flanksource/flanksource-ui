import { CellContext } from "@tanstack/react-table";
import React from "react";
import { ConfigItem } from "../../../../api/types/configs";
import { Badge } from "../../../../ui/Badge";
import ConfigsTypeIcon from "../../ConfigsTypeIcon";

function ConfigListNameCell({ row, getValue }: CellContext<ConfigItem, any>) {
  const isDeleted = !!row.original.deleted_at;
  const configType = row.original.type;

  return (
    <div
      className="flex flex-row space-x-2 items-center"
      style={{
        marginLeft: row.depth * 20
      }}
    >
      <ConfigsTypeIcon config={{ type: configType }} showPrimaryIcon={false}>
        <span>{getValue()}</span>
      </ConfigsTypeIcon>
      {isDeleted && (
        <Badge text="deleted" colorClass="text-white bg-gray-400" />
      )}
    </div>
  );
}

export default React.memo(ConfigListNameCell);
