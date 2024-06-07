import { useCallback, useMemo } from "react";
import { BiCheck } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { IoMdRemoveCircle } from "react-icons/io";
import { DateType } from "../../../../api/types/common";
import { Evidence } from "../../../../api/types/evidence";
import { Comment } from "../../../../api/types/incident";
import { UserWithTeam } from "../../../../api/types/users";
import { Age } from "../../../../ui/Age";
import { Avatar } from "../../../../ui/Avatar";
import { IconButton } from "../../../../ui/Buttons/IconButton";
import { CommentText } from "../../../../ui/Comment";
import { Icon } from "../../../../ui/Icons/Icon";
import { Menu } from "../../../../ui/Menu";
import { EvidenceItem } from "../EvidenceSection";

interface IProps {
  created_by: UserWithTeam;
  created_at?: DateType;
  response: Comment & Evidence;
  onDelete?: () => void;
  markAsDefinitionOfDone?: () => void;
}

function isEvidence(x: Comment | Evidence) {
  return (x as Evidence).type !== undefined;
}

export function ResponseLine({
  created_by,
  created_at,
  response,
  onDelete,
  markAsDefinitionOfDone
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
          <p className="mt-0.5 text-gray-500 leading-5 font-normal">
            <Age from={created_at} />
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
    definition_of_done?: boolean;
  };
  onClick: (action: ActionType) => void;
};

function ResponseLineMenuActions({
  actions,
  data,
  onClick
}: ResponseLineMenuActionsProps) {
  return (
    <Menu>
      {actions.delete && actions.markAsDefinitionOfDone && (
        <Menu.VerticalIconButton />
      )}
      <Menu.Items className="w-72">
        {actions.delete && (
          <Menu.Item
            onClick={() => {
              onClick("delete");
            }}
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
