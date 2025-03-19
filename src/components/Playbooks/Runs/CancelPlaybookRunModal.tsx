import { cancelPlaybookRun } from "@flanksource-ui/api/services/playbooks";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

type CancelPlaybookRunModalProps = {
  onClose: () => void;
  open: boolean;
  playbookRunId: string;
  refetch?: () => void;
};

export default function CancelPlaybookRunModal({
  onClose,
  open,
  playbookRunId,
  refetch = () => {}
}: CancelPlaybookRunModalProps) {
  const { mutate: cancel, isLoading } = useMutation({
    mutationFn: (id: string) => {
      return cancelPlaybookRun(id);
    },
    onError: (error: AxiosError) => {
      console.error("Failed to cancel playbook run", error);
      toastError(`Failed to cancel playbook run: ${error.message}`);
    },
    onSuccess: () => {
      onClose();
      refetch();
    }
  });

  return (
    <ConfirmationPromptDialog
      confirmationStyle="delete"
      title={`Cancel run`}
      description={<p>Are you sure you want to cancel this run?</p>}
      onConfirm={() => cancel(playbookRunId)}
      open={open}
      onClose={onClose}
      isOpen={open}
      yesLabel={isLoading ? "Cancelling..." : "Cancel"}
      closeLabel="Close"
    />
  );
}
