import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import {
  PlaybookRunsStatusProps,
  PlaybookStatusIcon
} from "../../../ui/Icons/PlaybookStatusIcon";
import ApprovePlaybookRunModal from "./ApprovePlaybookRunModal";

export function PlaybookStatusDescription({
  status,
  playbookTitle,
  showApproveButton = false,
  playbookRunId,
  refetch = () => {}
}: PlaybookRunsStatusProps & {
  playbookTitle: string;
  showApproveButton?: boolean;
  playbookRunId: string;
  refetch?: () => void;
}) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  if (status === "pending_approval" && showApproveButton) {
    return (
      <>
        <Button
          data-tooltip-content={`Approve ${playbookTitle} Run`}
          id="approve-playbook-run"
          size="xs"
          className="btn-link flex flex-row items-center"
          onClick={() => {
            setShowApprovalModal(true);
          }}
        >
          <PlaybookStatusIcon status={status} />
          <span className="capitalize">Pending Approval</span>
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

  return (
    <div className="flex flex-row items-center gap-1">
      <PlaybookStatusIcon status={status} />
      <span className="capitalize">{status}</span>
    </div>
  );
}
