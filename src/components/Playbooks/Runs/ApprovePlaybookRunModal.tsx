import { approvePlaybookRun } from "@flanksource-ui/api/services/playbooks";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

type ApprovePlaybookRunModalProps = {
  onClose: () => void;
  open: boolean;
  playbookTitle: string;
  playbookRunId: string;
  refetch?: () => void;
};

export default function ApprovePlaybookRunModal({
  onClose,
  open,
  playbookTitle,
  playbookRunId,
  refetch = () => {}
}: ApprovePlaybookRunModalProps) {
  const { mutate: approve, isLoading } = useMutation({
    mutationFn: (id: string) => {
      return approvePlaybookRun(id);
    },
    onError: (error: AxiosError) => {
      console.error("Failed to approve playbook run", error);
      toastError(`Failed to approve playbook run: ${error.message}`);
    },
    onSuccess: () => {
      onClose();
      refetch();
    }
  });

  return (
    <ConfirmationPromptDialog
      confirmationStyle="approve"
      title={`Approve Playbook ${playbookTitle} Run`}
      description={<p>Are you sure you want to approve this playbook run?</p>}
      onConfirm={() => approve(playbookRunId)}
      open={open}
      onClose={onClose}
      isOpen={open}
      yesLabel={isLoading ? "Approving..." : "Approve"}
      closeLabel="Cancel"
    />
  );
}
