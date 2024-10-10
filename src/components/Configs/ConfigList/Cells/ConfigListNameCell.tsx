import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import React from "react";
import { ConfigItem } from "../../../../api/types/configs";
import ConfigsTypeIcon from "../../ConfigsTypeIcon";

function ConfigListNameCell({ row, cell }: MRTCellProps<ConfigItem>) {
  const configType = row.original.type;

  return (
    <div
      className="flex flex-row items-center space-x-2"
      style={{
        marginLeft: row.depth * 20
      }}
    >
      <ConfigsTypeIcon config={{ type: configType }} showPrimaryIcon={false}>
        <span>{cell.getValue<string>()}</span>
      </ConfigsTypeIcon>
    </div>
  );
}

export default React.memo(ConfigListNameCell);
