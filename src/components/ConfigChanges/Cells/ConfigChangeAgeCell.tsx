import { CellContext } from "@tanstack/react-table";
import { ConfigTypeChanges } from "..";
import { Age } from "../../UI/Age";

export default function ConfigChangeAgeCell({
  row,
  column,
  getValue
}: CellContext<ConfigTypeChanges, unknown>) {
  return (
    <Age
      className="whitespace-nowrap  text-xs text-slate-500 pr-2"
      from={row.original.created_at}
    />
  );
}
