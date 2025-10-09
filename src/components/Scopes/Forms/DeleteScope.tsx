import { useDeleteScopeMutation } from "@flanksource-ui/api/query-hooks/useScopesQuery";
import {
  toastSuccess,
  toastError
} from "@flanksource-ui/components/Toast/toast";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";

type DeleteScopeProps = {
  scopeId: string;
  onDeleted: () => void;
};

export default function DeleteScope({ scopeId, onDeleted }: DeleteScopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteScope, isLoading } = useDeleteScopeMutation();

  const handleDelete = () => {
    deleteScope(scopeId, {
      onSuccess: () => {
        toastSuccess("Scope deleted");
        onDeleted();
      },
      onError: (error: any) => {
        toastError(error.message);
      }
    });
  };

  return (
    <>
      <Button
        text="Delete"
        icon={<FaTrash />}
        className="btn-danger"
        onClick={() => setIsOpen(true)}
      />

      <ConfirmationPromptDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Delete Scope"
        description="Are you sure you want to delete this scope? This action cannot be undone."
        yesLabel={isLoading ? "Deleting..." : "Delete"}
      />
    </>
  );
}
