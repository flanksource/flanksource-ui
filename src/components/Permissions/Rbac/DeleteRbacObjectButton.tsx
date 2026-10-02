import { deleteRbacObject } from "@flanksource-ui/api/services/rbacResources";
import {
  RbacResource,
  rbacResourceKinds
} from "@flanksource-ui/api/types/rbacResources";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

type DeleteRbacObjectButtonProps = {
  resource: RbacResource;
  namespace: string;
  name: string;
  onDeleted: () => void;
};

export default function DeleteRbacObjectButton({
  resource,
  namespace,
  name,
  onDeleted
}: DeleteRbacObjectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const label = rbacResourceKinds[resource].label;

  const { mutate, isLoading } = useMutation({
    mutationFn: () => deleteRbacObject(resource, namespace, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resource] });
      toastSuccess(`${label} deleted`);
      setIsOpen(false);
      onDeleted();
    },
    onError: (error) => {
      toastError(error);
    }
  });

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
        onConfirm={() => mutate()}
        title={`Delete ${label}`}
        description={`Are you sure you want to delete ${label.toLowerCase()} ${namespace}/${name}? This action cannot be undone.`}
        yesLabel={isLoading ? "Deleting..." : "Delete"}
      />
    </>
  );
}
