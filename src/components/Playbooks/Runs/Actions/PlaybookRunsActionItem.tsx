import { relativeDateTime } from "@flanksource-ui/utils/date";
import dayjs from "dayjs";
import { useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { PlaybookRunAction } from "../../../../api/types/playbooks";
import { Age } from "../../../../ui/Age";
import { PlaybookStatusIcon } from "../../../Icon/PlaybookStatusIcon";

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
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <div
      role="button"
      onClick={onClick}
      key={action.id}
      className={`flex flex-row items-center justify-between px-4 py-2 bg-white border border-gray-200 hover:bg-gray-200 rounded cursor-pointer ${
        isSelected ? "bg-gray-200" : ""
      }`}
    >
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 text-sm text-gray-600">
          <PlaybookStatusIcon status={action.status} />
          {action.name || `Step ${stepNumber}`}
        </div>
        <div className={`text-xs flex flex-row gap-1 items-center`}></div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="text-sm  text-gray-600">
          {action.status === "sleeping" ? (
            <span
              data-tip={`Scheduled to run in ${relativeDateTime(
                dayjs().toISOString(),
                action.scheduled_time
              )}`}
            >
              -
            </span>
          ) : (
            <Age from={action.start_time} to={action.end_time} />
          )}
        </div>
      </div>
    </div>
  );
}
