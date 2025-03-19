import { PlaybookRunStatus } from "@flanksource-ui/api/types/playbooks";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useState } from "react";
import { VscClose } from "react-icons/vsc";
import { Tooltip } from "react-tooltip";
import CancelPlaybookRunModal from "@flanksource-ui/components/Playbooks/Runs/CancelPlaybookRunModal";

type CancelPlaybookButtonProps = {
  playbookTitle: string;
  playbookRunId: string;
  status: PlaybookRunStatus;
  refetch: () => void;
};

export function CancelPlaybookButton({
  playbookTitle,
  playbookRunId,
  status,
  refetch = () => {}
}: CancelPlaybookButtonProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const terminalStatuses = ["cancelled", "completed", "failed"];
  if (terminalStatuses.includes(status)) {
    return null;
  }

  return (
    <>
      <Button
        data-tooltip-content={`Cancel ${playbookTitle} Run`}
        id="cancel-playbook-run"
        className="btn-white min-w-max space-x-1 text-red-500 hover:text-red-600"
        onClick={() => {
          setShowCancelModal(true);
        }}
      >
        <VscClose className="h-5 w-5" />
        <span>Cancel</span>
      </Button>

      <CancelPlaybookRunModal
        onClose={() => {
          setShowCancelModal(false);
        }}
        open={showCancelModal}
        playbookRunId={playbookRunId}
        refetch={refetch}
      />
      <Tooltip id="cancel-playbook-run" />
    </>
  );
}
