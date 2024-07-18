import { CellContext } from "@tanstack/react-table";
import { FaTrash } from "react-icons/fa";
import { Age } from "../../../../ui/Age";

export default function ConfigListDateCell<T extends Record<string, any>>({
  getValue,
  column,
  row
}: CellContext<T, any>) {
  const dateString = getValue();
  if (dateString === "0001-01-01T00:00:00") {
    return null;
  }
  const isDeleted = !!row.original.deleted_at;
  const value = isDeleted ? row.original.deleted_at : dateString;
  return (
    <div className="text-xs">
      <Age from={value} />
      {column.id === "updated_at" && isDeleted && (
        <FaTrash className="mx-2 inline h-4 w-4 align-middle text-gray-400" />
      )}
    </div>
  );
}
