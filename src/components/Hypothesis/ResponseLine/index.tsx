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

type CreatedBy = User & {
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
}

function isEvidence(x: Comment | Evidence): x is Evidence {
  return (x as Evidence).type !== undefined;
}

export function ResponseLine({
  created_by,
  created_at,
  response,
  onDelete,
  markAsDefinitionOfDone
}: IProps) {
  return (
    <div className="pb-4 flex items-start space-x-3 group">
      {created_by.team ? (
        <Icon size="2xl" name={created_by.team.icon} />
      ) : (
        <Avatar
          containerProps={{
            className: "mt-1"
          }}
          user={created_by}
        />
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

      {(markAsDefinitionOfDone || onDelete) && (
        <Menu>
          <Menu.VerticalIconButton />
          <Menu.Items widthClass="w-72">
            {onDelete && (
              <Menu.Item onClick={() => Promise.resolve(onDelete())}>
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
            {markAsDefinitionOfDone && (
              <Menu.Item onClick={markAsDefinitionOfDone}>
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
                      response.definition_of_done ? (
                        <IoMdRemoveCircle size={18} />
                      ) : (
                        <BiCheck size={18} />
                      )
                    }
                  />
                  {!response.definition_of_done && (
                    <span className="pl-2 text-sm block">
                      Add to definition of done
                    </span>
                  )}
                  {response.definition_of_done && (
                    <span className="pl-2 text-sm block">
                      Remove from definition of done
                    </span>
                  )}
                </div>
              </Menu.Item>
            )}
          </Menu.Items>
        </Menu>
      )}
    </div>
  );
}
