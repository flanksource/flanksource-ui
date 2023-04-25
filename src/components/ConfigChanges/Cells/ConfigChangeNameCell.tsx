import { CellContext } from "@tanstack/react-table";
import { ConfigTypeChanges } from "..";
import { ViewType } from "../../../types";
import { ConfigDetailsChanges } from "../../ConfigDetailsChanges/ConfigDetailsChanges";

export default function ConfigChangeNameCell({
  row,
  column,
  getValue
}: CellContext<ConfigTypeChanges, unknown>) {
  const item = row.original;
  return (
    <div className="whitespace-nowrap py-1">
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
