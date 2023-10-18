import { ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { relativeDateTime } from "../../../../utils/date";
import { Avatar } from "../../../Avatar";
import { Icon } from "../../../Icon";
import { PlaybookRun, PlaybookRunAction } from "../PlaybookRunTypes";
import PlaybookRunsStatus from "./../PlaybookRunsStatus";
import PlaybookRunActionFetch from "./PlaybookRunActionFetch";
import PlaybookRunsActionItem from "./PlaybookRunsActionItem";

export type PlaybookRunWithActions = PlaybookRun & {
  actions: PlaybookRunAction[];
};

type PlaybookRunActionsProps = {
  data: PlaybookRunWithActions;
};

export default function PlaybookRunsActions({ data }: PlaybookRunActionsProps) {
  const [selectedAction, setSelectedAction] = useState<PlaybookRunAction>();

  const headerContent = useMemo(
    () =>
      new Map<string, ReactNode>([
        [
          "Playbook",
          <Link
            className="text-blue-500 hover:underline"
            to={`/playbooks/${data.playbook_id}`}
          >
            {data.playbooks?.name}
          </Link>
        ],
        [
          "Component",
          <Link
            className="text-blue-500 hover:underline"
            to={`/topology/${data.component_id}`}
          >
            <Icon name={data.component?.icon} className="mr-1 h-5 w-5" />
            {data.component?.name}
          </Link>
        ],
        [
          "Status",
          <div className="flex flex-row gap-2 items-center">
            <PlaybookRunsStatus status={data.status} />
          </div>
        ],
        ["Start Time", relativeDateTime(data.start_time)],
        ["Duration", relativeDateTime(data.start_time, data.end_time)],
        [
          "Triggered By",
          data.created_by ? (
            <div className="flex flex-row gap-2">
              <Avatar user={data.created_by} />{" "}
              <span>{data.created_by.name}</span>
            </div>
          ) : null
        ]
      ]),
    [data]
  );

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div className="flex flex-col px-4 py-2">
        <div className="flex flex-row w-full lg:w-auto gap-4">
          {Array.from(headerContent).map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col gap-2 px-2 flex-1 xl:flex-none"
            >
              <div className="text-sm overflow-hidden truncate text-gray-500">
                {label}
              </div>
              <div className="flex justify-start break-all text-sm font-semibold">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row h-full">
        <div className="flex flex-col w-[15rem] lg:w-[20rem] h-full px-2 border-t border-gray-200">
          <div className="flex flex-row items-center justify-between px-4 py-2 mb-2 border-b border-gray-100">
            <div className="font-semibold text-gray-600">Actions</div>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto gap-2">
            {data.actions.map((action) => (
              <PlaybookRunsActionItem
                isSelected={selectedAction?.id === action.id}
                key={action.id}
                action={action}
                onClick={() => setSelectedAction(action)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col flex-1 h-full font-mono px-4 py-2 text-white bg-gray-700 overflow-hidden">
          {selectedAction && (
            <div className="flex flex-col flex-1 w-full overflow-x-hidden overflow-y-auto gap-2 whitespace-pre-wrap break-all">
              <PlaybookRunActionFetch playbookRunActionId={selectedAction.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
