import {
  datetimePreferenceAtom,
  displayTimezonePreferenceAtom
} from "@flanksource-ui/store/preference.state";
import LogItem from "@flanksource-ui/types/Logs";
import { formatDayjs } from "@flanksource-ui/ui/Age/Age";
import { IndeterminateCheckbox } from "@flanksource-ui/ui/FormControls/IndeterminateCheckbox";
import Popover from "@flanksource-ui/ui/Popover/Popover";
import { TagItem, TagList } from "@flanksource-ui/ui/Tags/TagList";
import { Cell } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";

export type LogsTableTimestampCellProps = React.HTMLProps<HTMLDivElement> & {
  cell: Cell<LogItem, unknown>;
  variant?: "comfortable" | "compact";
  viewOnly?: boolean;
  hideCheckbox?: boolean;
};

export function LogsTableTimestampCell({
  cell: { row },
  variant,
  viewOnly,
  hideCheckbox,
  className = "min-w-max flex flex-row text-left"
}: LogsTableTimestampCellProps) {
  let datetimePreference = useAtomValue(datetimePreferenceAtom);
  const displayTimezonePreference = useAtomValue(displayTimezonePreferenceAtom);
  console.log(row.original.firstObserved);

  return (
    <div className={className}>
      {!hideCheckbox && variant === "comfortable" && !viewOnly && (
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
      <p>
        {formatDayjs(
          dayjs(row.original.timestamp || row.original.firstObserved),
          displayTimezonePreference,
          datetimePreference,
          false
        )}
      </p>
    </div>
  );
}

export function LogsTableLabelsCell({
  cell: { row }
}: {
  cell: Cell<LogItem, unknown>;
}) {
  const labels = row.original.labels;
  if (!labels) {
    return (
      <div className="flex flex-row items-center">
        <div className="flex-shrink cursor-pointer overflow-x-hidden"></div>
      </div>
    );
  }
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
          <div className="flex-shrink cursor-pointer overflow-x-hidden">
            <TagItem tag={tags[0]!} />
          </div>
          {tags.length > 1 && (
            <div className="justify-left flex-shrink cursor-pointer space-x-2 text-xs underline decoration-solid">
              +{tags.length - 1} more
            </div>
          )}
        </div>
      }
      placement="left"
    >
      <div className="flex flex-col p-1">
        <div className="flex max-h-96 flex-col items-stretch overflow-y-auto">
          <TagList
            className="flex flex-1 flex-col"
            tags={tags}
            minimumItemsToShow={tags.length}
          />
        </div>
      </div>
    </Popover>
  );
}
