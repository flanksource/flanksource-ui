import LogItem from "@flanksource-ui/types/Logs";
import { IndeterminateCheckbox } from "@flanksource-ui/ui/FormControls/IndeterminateCheckbox";
import Popover from "@flanksource-ui/ui/Popover/Popover";
import { TagItem, TagList } from "@flanksource-ui/ui/Tags/TagList";
import { Cell } from "@tanstack/react-table";
import dayjs from "dayjs";

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

  return (
    <Popover
      toggle={
        <div className="flex flex-row items-center">
          <div className="flex-shrink overflow-x-hidden cursor-pointer">
            <TagItem tag={tags[0]!} />
          </div>
          {tags.length > 1 && (
            <div className="flex-shrink space-x-2 underline decoration-solid justify-left text-xs  cursor-pointer">
              +{tags.length - 1} more
            </div>
          )}
        </div>
      }
      placement="left"
    >
      <div className="flex flex-col p-1">
        <div className="flex flex-col items-stretch max-h-96 overflow-y-auto">
          <TagList
            className="flex flex-col flex-1"
            tags={tags}
            minimumItemsToShow={tags.length}
          />
        </div>
      </div>
    </Popover>
  );
}
