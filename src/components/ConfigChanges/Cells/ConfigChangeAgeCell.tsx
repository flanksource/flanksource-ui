import { CellContext } from "@tanstack/react-table";
import { ConfigTypeChanges } from "..";
import { relativeDateTime } from "../../../utils/date";

export default function ConfigChangeAgeCell({
  row,
  column,
  getValue
}: CellContext<ConfigTypeChanges, unknown>) {
  const age = relativeDateTime(row.original.created_at);
  return <span className="flex flex-nowrap py-1 text-sm">{age}</span>;
}
