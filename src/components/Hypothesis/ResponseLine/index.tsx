import { Evidence } from "../../../api/services/evidence";
import { User } from "../../../api/services/users";
import { relativeDateTime } from "../../../utils/relativeDateTime";
import { Avatar } from "../../Avatar";
import { CommentText } from "../../Comment";
import { EvidenceItem } from "../EvidenceSection";

interface IProps {
  created_by: User;
  created_at: string;
  response: string | Evidence;
}

export function ResponseLine({ created_by, created_at, response }: IProps) {
  return (
    <div className="pb-4 flex items-start space-x-3">
      <Avatar
        containerProps={{
          className: "mt-1"
        }}
        user={created_by}
      />
      <div className="min-w-0 flex-1">
        <div className="flex space-x-2">
          <div className="text-sm">
            <span className="text-gray-900 text-sm font-bold leading-5">
              {created_by?.name}
            </span>
          </div>
          <p className="mt-0.5 text-gray-500 text-xs leading-5 font-normal">
            {relativeDateTime(created_at)}
          </p>
        </div>

        {typeof response === "string" ? (
          <div className="text-sm text-gray-700">
            <p className="whitespace-pre">
              <CommentText text={response} />
            </p>
          </div>
        ) : (
          <EvidenceItem evidence={response} />
        )}
      </div>
    </div>
  );
}
