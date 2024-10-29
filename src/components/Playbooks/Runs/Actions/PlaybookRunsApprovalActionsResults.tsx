import {
  PlaybookApproval,
  PlaybookSpec
} from "@flanksource-ui/api/types/playbooks";
import { Avatar } from "@flanksource-ui/ui/Avatar";

type Props = {
  approval?: PlaybookApproval;
  className?: string;
  playbook: Pick<PlaybookSpec, "name">;
};

export default function PlaybookRunsApprovalActionsResults({
  approval,
  className = "whitespace-pre-wrap break-all",
  playbook
}: Props) {
  if (!approval) {
    return null;
  }

  return (
    <div className="relative flex h-full w-full flex-col">
      <p className="space-x-2">
        Approved by{" "}
        {approval.person_id ? (
          <Avatar user={approval.person_id} inline showName />
        ) : (
          <span className={className}>{approval.team_id?.name}</span>
        )}
      </p>
    </div>
  );
}
