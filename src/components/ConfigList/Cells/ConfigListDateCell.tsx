import { CellContext } from "@tanstack/react-table";
import { ConfigItem } from "../../../api/services/configs";
import { relativeDateTime } from "../../../utils/date";

export default function ConfigListDateCell({
  getValue
}: CellContext<ConfigItem, any>) {
  const dateString = getValue();
  if (dateString === "0001-01-01T00:00:00") {
    return null;
  }
  return (
    <div className="text-xs">
      {dateString ? relativeDateTime(dateString) : ""}
    </div>
  );
}
