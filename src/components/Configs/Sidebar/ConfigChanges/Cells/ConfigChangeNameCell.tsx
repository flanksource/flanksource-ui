import { CellContext } from "@tanstack/react-table";
import { ViewType } from "../../../../../types";
import { ConfigDetailsChanges } from "../../../Changes/ConfigDetailsChanges/ConfigDetailsChanges";
import { ConfigChange } from "../../../../../api/types/configs";

export default function ConfigChangeNameCell({
  row,
  column,
  getValue
}: CellContext<ConfigChange, unknown>) {
  const item = row.original;
  return (
    <div className="whitespace-nowrap text-xs">
      <ConfigDetailsChanges
        key={item.id}
        id={item.id}
        configId={item.config_id}
        viewType={ViewType.summary}
        data={item}
      />
    </div>
  );
}
