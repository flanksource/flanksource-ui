import FormatDuration from "@flanksource-ui/ui/Dates/FormatDuration";
import { relativeDateTime } from "@flanksource-ui/utils/date";
import clsx from "clsx";
import dayjs from "dayjs";
import { Tooltip } from "react-tooltip";
import { PlaybookRunAction } from "../../../../api/types/playbooks";
import { PlaybookStatusIcon } from "../../../../ui/Icons/PlaybookStatusIcon";

type PlaybookRunsActionItemProps = {
  action: Pick<
    PlaybookRunAction,
    "status" | "name" | "start_time" | "end_time" | "id" | "scheduled_time"
  >;
  onClick?: () => void;
  isSelected?: boolean;
  stepNumber: number;
};

export default function PlaybookRunsActionItem({
  action,
  onClick = () => {},
  isSelected = false,
  stepNumber
}: PlaybookRunsActionItemProps) {
  return (
    <>
      <div
        data-tooltip-id={action.id}
        role="button"
        onClick={() => {
          if (action.status !== "skipped") {
            onClick();
          }
        }}
        key={action.id}
        className={clsx(
          `flex flex-row items-center justify-between rounded border border-gray-200 px-4 py-2 hover:bg-gray-200`,
          isSelected ? "bg-gray-200" : "bg-white",
          action.status === "skipped" ? "cursor-not-allowed" : "cursor-pointer"
        )}
        data-tooltip-content={action.status}
      >
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 text-sm text-gray-600">
            <PlaybookStatusIcon status={action.status} />
            {action.name || `Step ${stepNumber}`}
          </div>
          <div className={`flex flex-row items-center gap-1 text-xs`}></div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-sm text-gray-600">
            {action.status === "sleeping" ? (
              <span
                data-tooltip-id="scheduled-tooltip"
                data-tooltip-content={`Scheduled to run in ${relativeDateTime(
                  dayjs().toISOString(),
                  action.scheduled_time
                )}`}
              >
                -
              </span>
            ) : (
              <FormatDuration
                startTime={action.start_time}
                endTime={action.end_time}
              />
            )}
          </div>
          <Tooltip id="scheduled-tooltip" />
        </div>
      </div>
      <Tooltip id={action.id} />
    </>
  );
}
