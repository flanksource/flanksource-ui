import { PlaybookRunStatus } from "@flanksource-ui/api/types/playbooks";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useState } from "react";
import { BsCheck2 } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import ApprovePlaybookRunModal from "./ApprovePlaybookRunModal";

type ApprovePlaybookButtonProps = {
  playbookTitle: string;
  playbookRunId: string;
  status: PlaybookRunStatus;
  refetch: () => void;
};

export function ApprovePlaybookButton({
  playbookTitle,
  playbookRunId,
  status,
  refetch = () => {}
}: ApprovePlaybookButtonProps) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  if (status !== "pending_approval") {
    return null;
  }

  return (
    <>
      <Button
        data-tooltip-content={`Approve ${playbookTitle} Run`}
        id="approve-playbook-run"
        className="btn-primary min-w-max space-x-1"
        onClick={() => {
          setShowApprovalModal(true);
        }}
      >
        <BsCheck2 className="h-5 w-5" />
        <span >Approve</span>
      </Button>
      <ApprovePlaybookRunModal
        onClose={() => {
          setShowApprovalModal(false);
        }}
        open={showApprovalModal}
        playbookTitle={playbookTitle}
        playbookRunId={playbookRunId}
        refetch={refetch}
      />
      <Tooltip id="approve-playbook-run" />
    </>
  );
}
