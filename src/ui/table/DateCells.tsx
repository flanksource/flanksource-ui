import { CellContext } from "@tanstack/react-table";
import { Age } from "../Age";
import { CreatedAt, UpdatedAt, Deletable } from "../../api/traits";

export function CreatedAtCell<T extends CreatedAt>({
  row,
  column,
  getValue
}: CellContext<T, unknown>) {
  return (
    <Age
      className="whitespace-nowrap  text-xs text-slate-500 pr-2"
      from={row.original.created_at}
    />
  );
}

export function UpdatedAtCell<T extends UpdatedAt>({
  row,
  column,
  getValue
}: CellContext<T, unknown>) {
  return (
    <Age
      className="whitespace-nowrap  text-xs text-slate-500 pr-2"
      from={row.original.updated_at}
    />
  );
}

export function DeletedAtCell<T extends Deletable>({
  row,
  column,
  getValue
}: CellContext<T, unknown>) {
  return (
    <Age
      className="whitespace-nowrap  text-xs text-slate-500 pr-2"
      from={row.original.deleted_at}
    />
  );
}

export function DateCell({ row, column }: CellContext<any, any>) {
  const dateString = row?.getValue<string>(column.id);
  return (
    <div className="text-xs">
      <Age from={dateString} />
    </div>
  );
}
