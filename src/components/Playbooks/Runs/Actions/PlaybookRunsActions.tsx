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
import ReRunPlaybookWithParamsButton from "../Submit/ReRunPlaybookWithParamsButton";
import { PlaybookStatusDescription } from "./../PlaybookRunsStatus";
import PlaybookRunActionFetch from "./PlaybookRunActionFetch";
import PlaybookRunsActionItem from "./PlaybookRunsActionItem";
import PlaybooksRunActionsResults from "./PlaybooksActionsResults";
import ShowPlaybookRunsParams from "./ShowParamaters/ShowPlaybookRunsParams";

type PlaybookRunActionsProps = {
  data: PlaybookRunWithActions;
  refetch?: () => void;
};

export default function PlaybookRunsActions({
  data,
  refetch = () => {}
}: PlaybookRunActionsProps) {
  const [selectedAction, setSelectedAction] = useState<
    PlaybookRunAction | undefined
  >(() => {
    // show the last action by default
    return data.actions.at(-1);
  });

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
    <div className="flex flex-1 flex-col gap-2 pl-2">
      <div className="flex flex-wrap py-4">
        <div className="flex w-full flex-wrap gap-4 lg:w-auto">
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
            value={
              <PlaybookStatusDescription
                status={data.status}
                playbookTitle={data.playbooks?.title ?? data.playbooks?.name!}
                showApproveButton
                playbookRunId={data.id}
                refetch={refetch}
              />
            }
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
                <div className="flex flex-row items-center gap-2">
                  <Avatar user={data.created_by} />{" "}
                  <span>{data.created_by.name}</span>
                </div>
              }
            />
          )}
        </div>
        <div className="ml-auto flex h-auto flex-col">
          <ReRunPlaybookWithParamsButton
            playbook={data.playbooks!}
            params={data.parameters}
            checkId={data.check_id}
            componentId={data.component_id}
            configId={data.config_id}
          />
        </div>
      </div>
      <div className="flex h-full flex-col">
        <div className="flex h-full flex-row">
          <div className="flex h-full w-[15rem] flex-col border-gray-200 pr-2 lg:w-[20rem]">
            <div className="mb-2 ml-[-25px] mr-[-15px] flex flex-row items-center justify-between border-t border-gray-200 py-2 pl-[25px]">
              <div className="font-semibold text-gray-600">Actions</div>
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
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
          <div className="flex h-full flex-1 flex-col overflow-hidden bg-gray-700 px-4 py-2 font-mono text-white">
            {selectedAction &&
              (selectedAction.id === "initialization" ? (
                <div className="flex w-full flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-all">
                  <PlaybooksRunActionsResults
                    action={selectedAction}
                    playbook={data.playbooks!}
                  />
                </div>
              ) : (
                <div className="flex w-full flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-all">
                  <PlaybookRunActionFetch
                    playbookRunActionId={selectedAction.id}
                    playbook={data.playbooks!}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
