import { deletePermission } from "@flanksource-ui/api/services/permissions";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { FaCircleNotch, FaTrash } from "react-icons/fa";

export default function DeletePermission({
  permissionId,
  onDeleted = () => {}
}: {
  permissionId: string;
  onDeleted: () => void;
}) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { mutate: deleteResource, isLoading } = useMutation({
    mutationFn: async (id: string) => {
      const res = await deletePermission(id);
      return res.data;
    },
    onSuccess: (_) => {
      toastSuccess("Permission deleted");
      onDeleted();
    },
    onError: (error: AxiosError) => {
      toastError(error.message);
    }
  });

  const onDeleteResource = useCallback(() => {
    setIsConfirmDialogOpen(false);
    deleteResource(permissionId);
  }, [deleteResource, permissionId]);

  return (
    <>
      <Button
        text="Delete"
        disabled={isLoading}
        icon={
          !isLoading ? <FaTrash /> : <FaCircleNotch className="animate-spin" />
        }
        className="btn-danger"
        onClick={() => setIsConfirmDialogOpen(true)}
      />

      {isConfirmDialogOpen && (
        <ConfirmationPromptDialog
          title="Delete Permission"
          description="Are you sure you want to permission?"
          onConfirm={onDeleteResource}
          isOpen={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          className="z-[9999]"
        />
      )}
    </>
  );
}
