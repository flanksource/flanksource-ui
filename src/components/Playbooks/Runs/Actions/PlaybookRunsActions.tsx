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
import { Menu } from "@flanksource-ui/ui/Menu";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { VscFileCode } from "react-icons/vsc";
import { FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
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
import ViewPlaybookSpecModal from "./ViewPlaybookSpecModal";
import ViewPlaybookParamsModal from "./ShowParamaters/ViewPlaybookParamsModal";

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

  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [isParamsModalOpen, setIsParamsModalOpen] = useState(false);

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

  const totalArtifacts = data.actions.reduce((acc, action) => {
    if (action.artifacts && action.artifacts.length > 0) {
      return acc + action.artifacts.length;
    }
    return acc;
  }, 0);

  return (
    <div className="flex flex-1 flex-col gap-2 pl-2">
      <div className="flex flex-wrap py-4">
        <div className="flex w-full flex-wrap gap-4 lg:w-auto">
          <VerticalDescription
            label="Playbook"
            value={
              <Link
                className="link"
                to={`/playbooks/runs?playbook=${data.playbook_id}`}
              >
                <PlaybookSpecIcon playbook={data.playbooks!} showLabel />
              </Link>
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
          {totalArtifacts > 0 && (
            <VerticalDescription
              label="Artifacts"
              value={
                <div className="flex items-center">
                  <FaFileAlt className="mr-1 text-gray-500" />
                  <span>{totalArtifacts}</span>
                </div>
              }
            />
          )}
        </div>
        <div className="ml-auto flex h-auto flex-col justify-center gap-2">
          <div className="flex flex-row items-center gap-2">
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

            <Menu>
              <Menu.VerticalIconButton />
              <Menu.Items style={{ zIndex: 100 }}>
                <Menu.Item>
                  <div
                    className="flex w-full cursor-pointer items-center gap-2"
                    onClick={() => {
                      setIsSpecModalOpen(true);
                    }}
                  >
                    <VscFileCode size={16} />
                    <span>Spec</span>
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    className={`flex w-full items-center gap-2 ${
                      !data.parameters ||
                      Object.keys(data.parameters).length === 0
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      if (
                        data.parameters &&
                        Object.keys(data.parameters).length > 0
                      ) {
                        setIsParamsModalOpen(true);
                      }
                    }}
                    title={
                      !data.parameters ||
                      Object.keys(data.parameters).length === 0
                        ? "No parameters available"
                        : ""
                    }
                  >
                    <FaCog size={16} />
                    <span>Parameters</span>
                    {(!data.parameters ||
                      Object.keys(data.parameters).length === 0) && (
                      <span className="text-gray-600">(none)</span>
                    )}
                  </div>
                </Menu.Item>
              </Menu.Items>
            </Menu>
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
                  isChild={action.playbook_run_id !== data.id}
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

      {/* Modals */}
      <ViewPlaybookSpecModal
        data={data}
        isModalOpen={isSpecModalOpen}
        setIsModalOpen={setIsSpecModalOpen}
      />
      <ViewPlaybookParamsModal
        data={data}
        isModalOpen={isParamsModalOpen}
        setIsModalOpen={setIsParamsModalOpen}
      />
    </div>
  );
}
