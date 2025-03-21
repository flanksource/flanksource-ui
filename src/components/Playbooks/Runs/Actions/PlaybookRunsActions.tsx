import {
  PlaybookApproval,
  PlaybookRunAction,
  PlaybookRunWithActions,
  PlaybookSpec
} from "@flanksource-ui/api/types/playbooks";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import FormatDuration from "@flanksource-ui/ui/Dates/FormatDuration";
import VerticalDescription from "@flanksource-ui/ui/description/VerticalDescription";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PlaybookSpecIcon from "../../Settings/PlaybookSpecIcon";
import { ApprovePlaybookButton } from "../ApprovePlaybookButton";
import { CancelPlaybookButton } from "../CancelPlaybookButton";
import { getResourceForRun } from "../services";
import ReRunPlaybookWithParamsButton from "../Submit/ReRunPlaybookWithParamsButton";
import { PlaybookStatusDescription } from "./../PlaybookRunsStatus";
import PlaybookRunActionFetch from "./PlaybookRunActionFetch";
import PlaybookRunsActionItem from "./PlaybookRunsActionItem";
import PlaybookRunsApprovalActionItem from "./PlaybookRunsApprovalActionItem";
import PlaybookRunsApprovalActionsResults from "./PlaybookRunsApprovalActionsResults";
import PlaybooksRunActionsResults from "./PlaybooksActionsResults";
import ShowPlaybookRunsParams from "./ShowParamaters/ShowPlaybookRunsParams";
import { useGetChildPlaybookRuns } from "@flanksource-ui/api/query-hooks/playbooks";
import { Loading } from "@flanksource-ui/ui/Loading";

type PlaybookRunActionsProps = {
  data: PlaybookRunWithActions;
  refetch?: () => void;
};

export default function PlaybookRunsActions({
  data,
  refetch = () => {}
}: PlaybookRunActionsProps) {
  const [selectedAction, setSelectedAction] = useState<
    | {
        type: "Action";
        data?: PlaybookRunAction;
        playbook: Pick<PlaybookSpec, "name">;
      }
    | {
        type: "Approval";
        data: PlaybookApproval;
      }
    | undefined
  >(() => {
    // show the last action by default
    return {
      type: "Action",
      data: data.actions.at(-1),
      playbook: data.playbooks!
    };
  });

  const { data: childRuns, isLoading: isLoadingChildRuns } =
    useGetChildPlaybookRuns(data.id);

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
                <div className="flex flex-row items-center gap-2">
                  <Avatar user={data.created_by} />{" "}
                  <span>{data.created_by.name}</span>
                </div>
              }
            />
          )}
          {data.notification_send_id && (
            <VerticalDescription
              label="Triggered By"
              value={
                <Link
                  className="link"
                  to={`/notifications?id=${data.notification_send_id}`}
                >
                  {"Notification"}
                </Link>
              }
            />
          )}
        </div>
        <div className="ml-auto flex h-auto flex-col justify-center gap-2">
          <div className="flex flex-row gap-2">
            <ApprovePlaybookButton
              playbookRunId={data.id}
              playbookTitle={data.playbooks?.title ?? data.playbooks?.name!}
              refetch={refetch}
              status={data.status}
            />

            <CancelPlaybookButton
              playbookRunId={data.id}
              playbookTitle={data.playbooks?.title ?? data.playbooks?.name!}
              refetch={refetch}
              status={data.status}
            />

            <ReRunPlaybookWithParamsButton
              playbook={data.playbooks!}
              params={data.parameters}
              checkId={data.check_id}
              componentId={data.component_id}
              configId={data.config_id}
            />
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col">
        <div className="flex h-full flex-row">
          <div className="flex h-full w-[15rem] flex-col border-gray-200 pr-2 lg:w-[20rem]">
            <div className="mb-2 ml-[-25px] mr-[-15px] flex flex-row items-center justify-between border-t border-gray-200 py-2 pl-[25px]">
              <div className="font-semibold text-gray-600">Actions</div>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
              {/* Parent Playbook Actions */}
              <div className="mb-4 space-y-2">
                {initializationAction && (
                  <PlaybookRunsActionItem
                    isSelected={
                      selectedAction?.type === "Action" &&
                      selectedAction.data?.id === initializationAction.id
                    }
                    key={initializationAction.id}
                    action={initializationAction}
                    onClick={() =>
                      setSelectedAction({
                        type: "Action",
                        data: initializationAction,
                        playbook: data.playbooks!
                      })
                    }
                    stepNumber={0}
                  />
                )}

                {data.playbook_approvals &&
                  data.playbook_approvals.length === 1 && (
                    <PlaybookRunsApprovalActionItem
                      isSelected={selectedAction?.type === "Approval"}
                      key={data.playbook_approvals[0].id}
                      approval={data.playbook_approvals[0]}
                      onClick={() =>
                        setSelectedAction({
                          type: "Approval",
                          data: data.playbook_approvals?.[0]!
                        })
                      }
                    />
                  )}

                {data.actions.map((action, index) => (
                  <PlaybookRunsActionItem
                    agent={action?.agent?.name}
                    isSelected={
                      selectedAction?.type === "Action" &&
                      selectedAction.data?.id === action.id
                    }
                    key={action.id}
                    action={action}
                    onClick={() =>
                      setSelectedAction({
                        type: "Action",
                        data: action,
                        playbook: data.playbooks!
                      })
                    }
                    stepNumber={index + (data.playbook_approvals ? 2 : 1)}
                  />
                ))}
              </div>

              {/* Child Playbooks Section */}
              {(isLoadingChildRuns || (childRuns && childRuns.length > 0)) && (
                <div className="mt-4">
                  <div className="mb-4 border-t border-gray-200 pt-4">
                    <div className="font-semibold text-gray-600">
                      Child Playbooks
                    </div>
                  </div>

                  {isLoadingChildRuns && (
                    <div className="flex items-center justify-center py-2">
                      <Loading text="Loading child runs..." />
                    </div>
                  )}

                  {childRuns?.map((childRun) => (
                    <div key={childRun.id} className="mb-4">
                      <div className="mb-2 flex items-center gap-2 pb-2">
                        <PlaybookSpecIcon
                          playbook={childRun.playbooks!}
                          showLabel
                        />

                        <Link
                          className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
                          to={`/playbooks/runs/${childRun.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </Link>
                      </div>

                      <div className="space-y-1">
                        {childRun.actions.map((action, index) => (
                          <PlaybookRunsActionItem
                            agent={action?.agent?.name}
                            isSelected={
                              selectedAction?.type === "Action" &&
                              selectedAction.data?.id === action.id
                            }
                            key={action.id}
                            action={action}
                            onClick={() =>
                              setSelectedAction({
                                type: "Action",
                                data: action,
                                playbook: childRun.playbooks!
                              })
                            }
                            stepNumber={index + 1}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Details */}
          <div className="flex h-full flex-1 flex-col overflow-hidden bg-black px-4 py-2 font-mono text-white">
            {selectedAction?.type === "Action" &&
              selectedAction.data?.id === "initialization" && (
                <div className="flex w-full flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-all">
                  <PlaybooksRunActionsResults
                    action={selectedAction.data}
                    playbook={selectedAction.playbook}
                  />
                </div>
              )}

            {selectedAction?.type === "Action" &&
              selectedAction.data?.id !== "initialization" && (
                <div className="flex w-full flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-all">
                  <PlaybookRunActionFetch
                    playbookRunActionId={selectedAction.data?.id!}
                    playbook={selectedAction.playbook}
                  />
                </div>
              )}

            {selectedAction?.type === "Approval" && (
              <div className="flex w-full flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-all">
                <PlaybookRunsApprovalActionsResults
                  approval={selectedAction.data}
                  playbook={data.playbooks!}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
