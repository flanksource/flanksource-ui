import { BsTrash } from "react-icons/bs";

import { Evidence } from "../../../api/services/evidence";
import { Comment } from "../../../api/services/comments";
import { User } from "../../../api/services/users";
import { relativeDateTime } from "../../../utils/date";
import { Avatar } from "../../Avatar";
import { CommentText } from "../../Comment";
import { IconButton } from "../../IconButton";
import { EvidenceItem } from "../EvidenceSection";
import { Icon } from "../../Icon";
import { Menu } from "../../Menu";
import { BiCheck } from "react-icons/bi";
import { IoMdRemoveCircle } from "react-icons/io";
import { useCallback, useMemo } from "react";
import { IncidentStatus } from "../../../api/services/incident";

export type CreatedBy = User & {
  team: {
    icon: string;
    name: string;
  };
};

interface IProps {
  created_by: CreatedBy;
  created_at: string;
  response: Comment & Evidence;
  onDelete?: () => void;
  markAsDefinitionOfDone?: () => void;
  currentStatus?: IncidentStatus;
}

function isEvidence(x: Comment | Evidence) {
  return (x as Evidence).type !== undefined;
}

export function ResponseLine({
  created_by,
  created_at,
  response,
  onDelete,
  markAsDefinitionOfDone,
  currentStatus
}: IProps) {
  const actions = useMemo(() => {
    return {
      delete: true,
      markAsDefinitionOfDone: true
    };
  }, []);

  const menuData = useMemo(() => {
    return {
      definition_of_done: response.definition_of_done
    };
  }, [response]);

  const onClickCb = useCallback(
    (action: ActionType) => {
      if (action === "delete") {
        onDelete?.();
      } else if (action === "markAsDefinitionOfDone") {
        markAsDefinitionOfDone?.();
      }
    },
    [onDelete, markAsDefinitionOfDone]
  );

  return (
    <div className="pb-4 flex items-start space-x-3 group">
      {created_by.team ? (
        <Icon className="rounded-full" name={created_by.team.icon} />
      ) : (
        <Avatar user={created_by} circular />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex space-x-2">
          <div className="text-sm">
            {created_by.team ? (
              <span className="text-gray-900 text-sm font-bold leading-5">
                {created_by.team.name} ({created_by?.name})
              </span>
            ) : (
              <span className="text-gray-900 text-sm font-bold leading-5">
                {created_by?.name}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-gray-500 text-xs leading-5 font-normal">
            {relativeDateTime(created_at)}
          </p>
        </div>

        {!isEvidence(response) ? (
          <div className="text-sm text-gray-700">
            <p className="whitespace-pre">
              <CommentText text={response.comment} />
            </p>
          </div>
        ) : (
          <EvidenceItem evidence={response} />
        )}
      </div>
      {isEvidence(response) && (
        <ResponseLineMenuActions
          actions={actions}
          data={menuData}
          onClick={onClickCb}
          currentStatus={currentStatus}
        />
      )}
    </div>
  );
}

type ActionType = "delete" | "markAsDefinitionOfDone";

type ResponseLineMenuActionsProps = {
  actions: {
    delete: boolean;
    markAsDefinitionOfDone: boolean;
  };
  data: {
    definition_of_done: boolean;
  };
  onClick: (action: ActionType) => void;
  currentStatus?: IncidentStatus;
};

function ResponseLineMenuActions({
  actions,
  data,
  onClick,
  currentStatus
}: ResponseLineMenuActionsProps) {
  return (
    <Menu>
      {actions.delete && actions.markAsDefinitionOfDone && (
        <Menu.VerticalIconButton />
      )}
      <Menu.Items widthClass="w-72">
        {actions.delete && (
          <Menu.Item
            onClick={() => {
              onClick("delete");
            }}
            disabled={currentStatus == "closed"}
          >
            <div className="cursor-pointer flex w-full">
              <IconButton
                className="bg-transparent flex items-center"
                ovalProps={{
                  stroke: "blue",
                  height: "18px",
                  width: "18px",
                  fill: "transparent"
                }}
                icon={
                  <BsTrash
                    className="text-gray-600 border-0 border-l-1 border-gray-200"
                    size={18}
                  />
                }
              />
              <span className="pl-2 text-sm block cursor-pionter">
                Delete Evidence
              </span>
            </div>
          </Menu.Item>
        )}
        {actions.markAsDefinitionOfDone && (
          <Menu.Item
            onClick={() => {
              onClick("markAsDefinitionOfDone");
            }}
            disabled={currentStatus == "closed"}
          >
            <div className="cursor-pointer flex w-full">
              <IconButton
                className="bg-transparent flex items-center"
                ovalProps={{
                  stroke: "blue",
                  height: "18px",
                  width: "18px",
                  fill: "transparent"
                }}
                icon={
                  data.definition_of_done ? (
                    <IoMdRemoveCircle size={18} />
                  ) : (
                    <BiCheck size={18} />
                  )
                }
              />
              {!data.definition_of_done && (
                <span className="pl-2 text-sm block">
                  Add to definition of done
                </span>
              )}
              {data.definition_of_done && (
                <span className="pl-2 text-sm block">
                  Remove from definition of done
                </span>
              )}
            </div>
          </Menu.Item>
        )}
      </Menu.Items>
    </Menu>
  );
}
