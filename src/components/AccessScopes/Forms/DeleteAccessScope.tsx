import { useDeleteAccessScopeMutation } from "@flanksource-ui/api/query-hooks/useAccessScopesQuery";
import {
  toastSuccess,
  toastError
} from "@flanksource-ui/components/Toast/toast";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";

type DeleteAccessScopeProps = {
  accessScopeId: string;
  onDeleted: () => void;
};

export default function DeleteAccessScope({
  accessScopeId,
  onDeleted
}: DeleteAccessScopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteAccessScope, isLoading } =
    useDeleteAccessScopeMutation();

  const handleDelete = () => {
    deleteAccessScope(accessScopeId, {
      onSuccess: () => {
        toastSuccess("Access Scope deleted");
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
        title="Delete Access Scope"
        description="Are you sure you want to delete this access scope? This action cannot be undone."
        yesLabel={isLoading ? "Deleting..." : "Delete"}
      />
    </>
  );
}
