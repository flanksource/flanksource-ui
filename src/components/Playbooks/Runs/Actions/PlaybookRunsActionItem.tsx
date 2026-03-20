import FormatDuration from "@flanksource-ui/ui/Dates/FormatDuration";
import { relativeDateTime } from "@flanksource-ui/utils/date";
import clsx from "clsx";
import dayjs from "dayjs";
import { Tooltip } from "react-tooltip";
import { PlaybookRunAction } from "../../../../api/types/playbooks";
import { PlaybookStatusIcon } from "../../../../ui/Icons/PlaybookStatusIcon";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { TbCornerDownRight } from "react-icons/tb";

function ActionTimestampTooltip({
  action
}: {
  action: Pick<
    PlaybookRunAction,
    "id" | "status" | "scheduled_time" | "start_time" | "end_time"
  >;
}) {
  const fmt = (t?: string) =>
    t ? dayjs(t).local().format("YYYY-MM-DD HH:mm:ss") : null;

  const scheduledFmt = fmt(action.scheduled_time);
  const startFmt = fmt(action.start_time);
  const endFmt = fmt(action.end_time);

  const delayMs =
    action.scheduled_time && action.start_time
      ? dayjs(action.start_time).diff(dayjs(action.scheduled_time))
      : 0;

  const showDelay = delayMs > 1000;

  if (!scheduledFmt && !startFmt && !endFmt) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 text-xs">
      {scheduledFmt && (
        <div className="flex gap-2">
          <span className="min-w-[65px] text-gray-400">Scheduled:</span>
          <span>{scheduledFmt}</span>
        </div>
      )}
      {startFmt && (
        <div className="flex gap-2">
          <span className="min-w-[65px] text-gray-400">Started:</span>
          <span>{startFmt}</span>
          {showDelay && action.scheduled_time && (
            <span className="text-gray-400">
              (Δ {relativeDateTime(action.scheduled_time, action.start_time)})
            </span>
          )}
        </div>
      )}
      {endFmt && (
        <div className="flex gap-2">
          <span className="min-w-[65px] text-gray-400">Ended:</span>
          <span>{endFmt}</span>
        </div>
      )}
    </div>
  );
}

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
        title={action.status}
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
      >
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 text-sm text-gray-600">
            <PlaybookStatusIcon status={action.status} />
            <div className="flex flex-col">
              <div className="flex flex-row flex-wrap items-center gap-2">
                <span className="max-w-[180px] truncate">
                  {action.name || `Step ${stepNumber}`}
                </span>
                {agent && <Badge text={agent} />}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <div className="text-sm text-gray-600">
            {action.status === "sleeping" ? (
              <span className="text-blue-400">
                in{" "}
                {relativeDateTime(dayjs().toISOString(), action.scheduled_time)}
              </span>
            ) : (
              <FormatDuration
                startTime={action.start_time}
                endTime={action.end_time}
              />
            )}
          </div>
        </div>
      </div>
      <Tooltip id={action.id}>
        <ActionTimestampTooltip action={action} />
      </Tooltip>
    </div>
  );
}
