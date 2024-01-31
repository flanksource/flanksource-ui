import { useCallback, useState } from "react";
import { FaCircleNotch, FaTrash } from "react-icons/fa";
import { useDeleteAgentMutations } from "../../api/query-hooks/mutations/useUpsertAgentMutations";
import { Button } from "../../ui/Button";
import { ConfirmationPromptDialog } from "../Dialogs/ConfirmationPromptDialog";
import { toastError, toastSuccess } from "../Toast/toast";

type DeleteAgentButtonProps = {
  agentId: string;
  onDeleted?: () => void;
};

export default function DeleteAgentButton({
  agentId,
  onDeleted = () => {}
}: DeleteAgentButtonProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCleanupDialogOpen, setIsCleanupDialogOpen] = useState(false);
  const [cleanup, setCleanup] = useState(false);

  const { mutate: deleteResource, isLoading } = useDeleteAgentMutations({
    onSuccess: (_) => {
      toastSuccess("Agent deleted");
      onDeleted();
    },
    onError: (error) => {
      toastError(error.message);
    }
  });

  const onDeleteResource = useCallback(() => {
    setIsConfirmDialogOpen(false);
    deleteResource({ id: agentId, cleanup });
  }, [agentId, cleanup, deleteResource]);

  return (
    <>
      <Button
        text="Delete"
        disabled={isLoading}
        icon={
          !isLoading ? <FaTrash /> : <FaCircleNotch className="animate-spin" />
        }
        className="btn-danger"
        onClick={() => setIsCleanupDialogOpen(true)}
      />

      <ConfirmationPromptDialog
        title="Delete Agents Resources"
        description="Would you like to delete resources created by agent?"
        onConfirm={() => {
          setCleanup(true);
          setIsCleanupDialogOpen(false);
          setIsConfirmDialogOpen(true);
        }}
        isOpen={isCleanupDialogOpen}
        yesLabel="Yes"
        closeLabel="No"
        onClose={() => {
          setCleanup(false);
          setIsCleanupDialogOpen(false);
          setIsConfirmDialogOpen(true);
        }}
        className="z-[9999]"
      />

      {isConfirmDialogOpen && (
        <ConfirmationPromptDialog
          title="Delete Agent"
          description="Are you sure you want to delete agent?"
          onConfirm={onDeleteResource}
          isOpen={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          className="z-[9999]"
        />
      )}
    </>
  );
}
