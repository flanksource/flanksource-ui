import { Cell } from "@tanstack/react-table";
import dayjs from "dayjs";
import LogItem from "../../../types/Logs";
import { IndeterminateCheckbox } from "../../IndeterminateCheckbox/IndeterminateCheckbox";
import { TagList } from "../../TagList/TagList";

export type LogsTableTimestampCellProps = React.HTMLProps<HTMLDivElement> & {
  cell: Cell<LogItem, unknown>;
  variant?: "comfortable" | "compact";
  viewOnly?: boolean;
};

export function LogsTableTimestampCell({
  cell: { row },
  variant,
  viewOnly,
  className = "min-w-max flex flex-row text-left"
}: LogsTableTimestampCellProps) {
  return (
    <div className={className}>
      {variant === "comfortable" && !viewOnly && (
        <div className="mr-1.5">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        </div>
      )}
      <p>{dayjs(row.original.timestamp).format("YYYY-MM-DD HH:mm.ss.SSS")}</p>
    </div>
  );
}

export function LogsTableLabelsCell({
  cell: { row }
}: {
  cell: Cell<LogItem, unknown>;
}) {
  const labels = row.original.labels;
  const tags = Object.entries(labels).map(([key, value]) => {
    return {
      key,
      value
    };
  });

  return <TagList tags={tags} />;
}
