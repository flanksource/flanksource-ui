import FormatDuration from "@flanksource-ui/ui/Dates/FormatDuration";
import { relativeDateTime } from "@flanksource-ui/utils/date";
import clsx from "clsx";
import dayjs from "dayjs";
import { Tooltip } from "react-tooltip";
import { PlaybookRunAction } from "../../../../api/types/playbooks";
import { PlaybookStatusIcon } from "../../../../ui/Icons/PlaybookStatusIcon";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { TbCornerDownRight } from "react-icons/tb";

type PlaybookRunsActionItemProps = {
  agent?: string;
  action: Pick<
    PlaybookRunAction,
    "status" | "name" | "start_time" | "end_time" | "id" | "scheduled_time"
  >;
  onClick?: () => void;
  isSelected?: boolean;
  stepNumber: number;
  isChild?: boolean;
};

export default function PlaybookRunsActionItem({
  action,
  onClick = () => {},
  agent,
  isSelected = false,
  isChild = false,
  stepNumber
}: PlaybookRunsActionItemProps) {
  return (
    <div className="flex flex-row items-center">
      {isChild && (
        <>
          <TbCornerDownRight
            data-tooltip-id="child-run-tooltip"
            data-tooltip-content="Child Run"
            className="mr-1 flex-shrink-0 text-gray-500"
            size={16}
          />
          <Tooltip id="child-run-tooltip" />
        </>
      )}
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
          `flex flex-grow flex-row items-center justify-between rounded border border-gray-200 px-4 py-2 hover:bg-gray-200`,
          isSelected ? "bg-gray-200" : "bg-white",
          action.status === "skipped" ? "cursor-not-allowed" : "cursor-pointer"
        )}
        data-tooltip-content={action.status}
      >
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 text-sm text-gray-600">
            <PlaybookStatusIcon status={action.status} />
            <div className="flex flex-col">
              <div className="flex flex-row flex-wrap items-center gap-2">
                {action.name || `Step ${stepNumber}`}
                {agent && <Badge text={agent} />}
              </div>
            </div>
          </div>
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
    </div>
  );
}
