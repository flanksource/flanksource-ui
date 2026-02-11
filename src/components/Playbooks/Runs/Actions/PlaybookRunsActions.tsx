import {
  CategorizedPlaybookRunAction,
  PlaybookApproval,
  PlaybookRunWithActions,
  PlaybookSpec,
  PlaybookRun
} from "@flanksource-ui/api/types/playbooks";
import { Age } from "@flanksource-ui/ui/Age";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import FormatDuration from "@flanksource-ui/ui/Dates/FormatDuration";
import VerticalDescription from "@flanksource-ui/ui/description/VerticalDescription";
import { Menu } from "@flanksource-ui/ui/Menu";
import dayjs from "dayjs";
import { lazy, Suspense, useMemo, useState } from "react";
import { VscFileCode } from "react-icons/vsc";
import { FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
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
import FailedChildRunComponent from "./FailedChildRunComponent";
import { Sparkles } from "lucide-react";
import { AiFeatureRequest } from "@flanksource-ui/ui/Layout/AiFeatureLoader";
import { useFeatureFlagsContext } from "@flanksource-ui/context/FeatureFlagsContext";
import { features } from "@flanksource-ui/services/permissions/features";
import { Button } from "@flanksource-ui/components/ui/button";

const LazyDiagnoseButton = lazy(() =>
  import("../DiagnosePlaybookFailureButton").then((module) => ({
    default: module.DiagnosePlaybookFailureButton
  }))
);

type PlaybookRunActionsProps = {
  data: PlaybookRunWithActions;
  refetch?: () => void;
};

/**
 * Displays the detail view for a single playbook run, including run metadata
 * (status, duration, triggered by, etc.), an action sidebar listing each step,
 * and a result panel showing the selected action's output. For failed runs,
 * an AI "Diagnose Failure" button is rendered to open the navbar AI chat
 * pre-populated with run context.
 */
export default function PlaybookRunDetailView({
  data,
  refetch = () => {}
}: PlaybookRunActionsProps) {
  const [selectedAction, setSelectedAction] = useState<
    | {
        type: "Action";
        data?: CategorizedPlaybookRunAction;
        playbook: PlaybookSpec;
      }
    | {
        type: "Approval";
        data: PlaybookApproval;
      }
    | {
        type: "FailedChildRun";
        data: PlaybookRun;
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

  const { isFeatureDisabled } = useFeatureFlagsContext();
  const isAiDisabled = isFeatureDisabled(features.ai);

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
      } satisfies CategorizedPlaybookRunAction;
    }
  }, [data.end_time, data.error, data.id, data.start_time, data.status]);

  const totalArtifacts = data.actions.reduce((acc, action) => {
    if (action.artifacts && action.artifacts.length > 0) {
      return acc + action.artifacts.length;
    }
    return acc;
  }, 0);

  const { runCost, totalInputTokens, totalOutputTokens } = useMemo(() => {
    let cost = 0;
    let inputTokens = 0;
    let outputTokens = 0;

    data.actions.forEach((action) => {
      if (!action.result) {
        return;
      }

      const generationInfo = action.result["generationInfo"] as {
        cost: number;
        inputTokens: number;
        outputTokens: number;
      }[];

      if (generationInfo) {
        generationInfo.forEach((info) => {
          cost += info.cost;
          inputTokens += info.inputTokens;
          outputTokens += info.outputTokens;
        });
      }
    });

    return {
      runCost: cost,
      totalInputTokens: inputTokens,
      totalOutputTokens: outputTokens
    };
  }, [data.actions]);

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

        {/* Run action buttons: approve, cancel, AI diagnose (failed only), rerun, and kebab menu */}
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

            {!isAiDisabled && data.status === "failed" && (
              <AiFeatureRequest>
                <Suspense
                  fallback={
                    <Button size="sm" variant="outline" disabled>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </Button>
                  }
                >
                  <LazyDiagnoseButton data={data} />
                </Suspense>
              </AiFeatureRequest>
            )}

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
              <div className="font-semibold text-gray-600">
                Actions{" "}
                {(totalInputTokens > 0 || totalOutputTokens > 0) && (
                  <span
                    data-tooltip-id="action-cost-tooltip"
                    data-tooltip-content={`${(totalInputTokens + totalOutputTokens).toLocaleString()} tokens (${totalInputTokens.toLocaleString()} input + ${totalOutputTokens.toLocaleString()} output)`}
                    className="font-mono text-sm text-gray-500"
                  >
                    (${runCost.toFixed(2)})
                  </span>
                )}
              </div>
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

              {data.childRuns
                ?.filter((run) => run.status === "failed")
                .map((run, index) => (
                  <FailedChildRunComponent
                    key={run.id}
                    run={run}
                    isSelected={
                      selectedAction?.type === "FailedChildRun" &&
                      selectedAction.data.id === run.id
                    }
                    onClick={() =>
                      setSelectedAction({
                        type: "FailedChildRun",
                        data: run
                      })
                    }
                    stepNumber={index + 1}
                  />
                ))}

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
                  <PlaybooksRunActionsResults action={selectedAction.data} />
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

            {selectedAction?.type === "FailedChildRun" && (
              <div className="flex w-full flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-all">
                <div className="flex flex-col gap-2">
                  <pre className="whitespace-pre-wrap break-all text-red-400">
                    {selectedAction.data.error}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tooltips */}
      <Tooltip id="action-cost-tooltip" />

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
