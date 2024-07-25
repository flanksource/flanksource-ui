import { CellContext } from "@tanstack/react-table";
import React from "react";
import { ConfigItem } from "../../../../api/types/configs";
import ConfigsTypeIcon from "../../ConfigsTypeIcon";

function ConfigListNameCell({ row, getValue }: CellContext<ConfigItem, any>) {
  const configType = row.original.type;

  return (
    <div
      className="flex flex-row items-center space-x-2"
      style={{
        marginLeft: row.depth * 20
      }}
    >
      <ConfigsTypeIcon config={{ type: configType }} showPrimaryIcon={false}>
        <span>{getValue()}</span>
      </ConfigsTypeIcon>
    </div>
  );
}

export default React.memo(ConfigListNameCell);
