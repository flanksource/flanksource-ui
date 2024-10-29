import { PlaybookApproval } from "@flanksource-ui/api/types/playbooks";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import clsx from "clsx";
import { BsCheck2Circle } from "react-icons/bs";

type PlaybookRunsActionItemProps = {
  onClick?: () => void;
  isSelected?: boolean;
  approval: PlaybookApproval;
};

export default function PlaybookRunsApprovalActionItem({
  onClick = () => {},
  isSelected = false,
  approval
}: PlaybookRunsActionItemProps) {
  return (
    <div
      role="button"
      className={clsx(
        `flex flex-row items-center justify-between rounded border border-gray-200 px-4 py-2 hover:bg-gray-200`,
        isSelected ? "bg-gray-200" : "bg-white"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-2 text-sm text-gray-600">
          <BsCheck2Circle className="text-green-500 h-5 w-auto" />
          Approved by{" "}
          {approval?.person_id ? (
            <Avatar user={approval.person_id} inline showName size="xs" />
          ) : (
            <span className="whitespace-pre-wrap break-all">
              {approval.team_id?.name}
            </span>
          )}
        </div>
        <div className={`flex flex-row items-center gap-1 text-xs`}></div>
      </div>
    </div>
  );
}
