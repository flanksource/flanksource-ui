import { CellContext } from "@tanstack/react-table";
import { FaTrash } from "react-icons/fa";
import { ConfigItem } from "../../../api/services/configs";
import { relativeDateTime } from "../../../utils/date";

export default function ConfigListDateCell({
  getValue,
  column,
  row
}: CellContext<ConfigItem, any>) {
  const dateString = getValue();
  if (dateString === "0001-01-01T00:00:00") {
    return null;
  }
  const isDeleted = !!row.original.deleted_at;
  const value = isDeleted ? row.original.deleted_at : dateString;
  return (
    <div className="text-xs">
      {value ? relativeDateTime(value) : ""}
      {column.id === "updated_at" && isDeleted && (
        <FaTrash className="h-4 w-4 inline align-middle mx-2 text-gray-400" />
      )}
    </div>
  );
}
