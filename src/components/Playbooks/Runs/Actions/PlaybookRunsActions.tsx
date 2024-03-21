import {
  PlaybookRunAction,
  PlaybookRunWithActions
} from "@flanksource-ui/api/types/playbooks";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import FormatDuration from "@flanksource-ui/ui/Dates/FormatDuration";
import VerticalDescription from "@flanksource-ui/ui/description/VerticalDescription";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PlaybookSpecIcon from "../../Settings/PlaybookSpecIcon";
import { getResourceForRun } from "../services";
import { PlaybookStatusDescription } from "./../PlaybookRunsStatus";
import PlaybookRunActionFetch from "./PlaybookRunActionFetch";
import PlaybookRunsActionItem from "./PlaybookRunsActionItem";
import PlaybooksRunActionsResults from "./PlaybooksActionsResults";
import ShowPlaybookRunsParams from "./ShowParamaters/ShowPlaybookRunsParams";

type PlaybookRunActionsProps = {
  data: PlaybookRunWithActions;
};

export default function PlaybookRunsActions({ data }: PlaybookRunActionsProps) {
  const [selectedAction, setSelectedAction] = useState<PlaybookRunAction>();
  const resource = getResourceForRun(data);

  // if the playbook run failed, create an action for the initialization step
  // that shows the error message
  const initializationAction = useMemo(() => {
    if (data.status === "failed" && data.error) {
      return {
        id: "initialization",
        name: "Initialization",
        start_time: data.start_time,
        end_time: data.end_time,
        status: "failed",
        playbook_run_id: data.id,
        error: data.error
      } satisfies PlaybookRunAction;
    }
  }, [data.end_time, data.error, data.id, data.start_time, data.status]);

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div className="flex flex-col px-4 py-2">
        <div className="flex flex-row w-full lg:w-auto gap-4">
          <VerticalDescription
            label="Playbook"
            value={
              <>
                <Link
                  className="link"
                  to={`/playbooks/runs?playbook=${data.playbook_id}`}
                >
                  <PlaybookSpecIcon playbook={data.playbooks!} showLabel />
                </Link>
                <ShowPlaybookRunsParams data={data} />
              </>
            }
          />

          <VerticalDescription
            label="Status"
            value={<PlaybookStatusDescription status={data.status} />}
          />
          <VerticalDescription
            label="Started"
            value={<Age from={data.start_time} suffix={true} />}
          />
          {data.scheduled_time &&
            // if scheduled time is in the future, show it, otherwise it's in
            // the past and we don't need to show it here
            dayjs().isBefore(dayjs(data.scheduled_time)) && (
              <VerticalDescription
                label="Scheduled"
                value={
                  <Age
                    from={dayjs().toISOString()}
                    to={data.scheduled_time}
                    suffix={true}
                  />
                }
              />
            )}
          <VerticalDescription
            label="Duration"
            value={
              <FormatDuration
                startTime={data.start_time}
                endTime={data.end_time}
              />
            }
          />
          <VerticalDescription
            label="Queued"
            value={<Age from={data.created_at} to={data.start_time} />}
          />
          {resource && (
            <VerticalDescription label={resource.label} value={resource.link} />
          )}
          {data.created_by && (
            <VerticalDescription
              label="Triggered By"
              value={
                <div className="flex flex-row gap-2 items-center">
                  <Avatar user={data.created_by} />{" "}
                  <span>{data.created_by.name}</span>
                </div>
              }
            />
          )}
        </div>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex flex-row h-full">
          <div className="flex flex-col w-[15rem] lg:w-[20rem] h-full pr-2  border-gray-200">
            <div className="flex flex-row items-center justify-between ml-[-25px] mr-[-15px] pl-[25px] py-2 mb-2 border-t border-gray-200">
              <div className="font-semibold text-gray-600">Actions</div>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto gap-2">
              {initializationAction && (
                <PlaybookRunsActionItem
                  isSelected={selectedAction?.id === initializationAction.id}
                  key={initializationAction.id}
                  action={initializationAction}
                  onClick={() => setSelectedAction(initializationAction)}
                  stepNumber={0}
                />
              )}
              {data.actions.map((action, index) => (
                <PlaybookRunsActionItem
                  isSelected={selectedAction?.id === action.id}
                  key={action.id}
                  action={action}
                  onClick={() => setSelectedAction(action)}
                  stepNumber={index + 1}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col flex-1 h-full font-mono px-4 py-2 text-white bg-gray-700 overflow-hidden">
            {selectedAction &&
              (selectedAction.id === "initialization" ? (
                <div className="flex flex-col flex-1 w-full overflow-x-hidden overflow-y-auto gap-2 whitespace-pre-wrap break-all">
                  <PlaybooksRunActionsResults action={selectedAction} />
                </div>
              ) : (
                <div className="flex flex-col flex-1 w-full overflow-x-hidden overflow-y-auto gap-2 whitespace-pre-wrap break-all">
                  <PlaybookRunActionFetch
                    playbookRunActionId={selectedAction.id}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
