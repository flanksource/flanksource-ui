import { useEffect, useMemo } from "react";
import { FaCircleNotch, FaTrash } from "react-icons/fa";
import { Age } from "@flanksource-ui/ui/Age";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteToken, setTokenRoles, Token } from "../../api/services/tokens";
import { Button } from "../../ui/Buttons/Button";
import { Modal } from "../../ui/Modal";
import { ConfirmationPromptDialog } from "../../ui/AlertDialog/ConfirmationPromptDialog";
import { toastError, toastSuccess } from "../Toast/toast";
import { useState } from "react";
import { TokenRoleBindings } from "./TokenRoleBindings";
import { AddTokenRole } from "./AddTokenRole";

type TokenDetailsModalProps = {
  token: Token;
  isOpen: boolean;
  onClose: () => void;
};

export default function TokenDetailsModal({
  token,
  isOpen,
  onClose
}: TokenDetailsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteTokenMutation, isLoading: isDeleting } = useMutation({
    mutationFn: deleteToken,
    onSuccess: () => {
      toastSuccess("Token deleted successfully");
      queryClient.invalidateQueries(["tokens", "list"]);
      onClose();
    },
    onError: (error: any) => {
      toastError(error?.message || "Failed to delete token");
    }
  });

  const savedRoles = useMemo(
    () => (token.role_bindings ?? []).map((binding) => binding.role),
    [token.role_bindings]
  );
  const [roles, setRoles] = useState(savedRoles);
  useEffect(() => setRoles(savedRoles), [savedRoles]);
  const isDirty =
    roles.length !== savedRoles.length ||
    roles.some((role) => !savedRoles.includes(role));

  const { mutate: saveRoles, isLoading: isSaving } = useMutation({
    mutationFn: () =>
      setTokenRoles(
        token.id,
        roles.map((role) => {
          const [namespace, name] = role.split("/");
          return { namespace, name };
        })
      ),
    onSuccess: () => {
      toastSuccess("Token roles saved");
      queryClient.invalidateQueries(["tokens", "list"]);
    },
    onError: (error: any) => {
      toastError(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to save the token's roles"
      );
    }
  });

  const formattedCreatedAt = useMemo(() => {
    return new Date(token.created_at).toISOString();
  }, [token.created_at]);

  const handleDeleteToken = () => {
    deleteTokenMutation(token.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Modal
        title="Token Details"
        onClose={onClose}
        open={isOpen}
        bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      >
        <div className="flex flex-col space-y-6 p-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <div className="text-sm text-gray-900">{token.name}</div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Created At
            </label>
            <Age from={formattedCreatedAt} />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Role Bindings
            </label>
            <TokenRoleBindings
              bindings={token.role_bindings}
              roles={roles}
              onChange={setRoles}
              disabled={isSaving}
            />
            <AddTokenRole
              boundRoles={roles}
              disabled={isSaving}
              onAdd={(role) => setRoles([...roles, role])}
            />
            <p className="text-sm text-gray-500">
              The token can do what both your current access and these roles
              allow. A binding never grants the token anything. Saved changes
              apply to the token's next request.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-100 px-6 py-4">
          <Button
            text="Delete"
            disabled={isDeleting || isSaving}
            icon={
              !isDeleting ? (
                <FaTrash />
              ) : (
                <FaCircleNotch className="animate-spin" />
              )
            }
            className="btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
          />
          <div className="flex items-center gap-2">
            <Button
              text="Cancel"
              className="btn-white"
              disabled={!isDirty || isSaving}
              onClick={() => setRoles(savedRoles)}
            />
            <Button
              text={isSaving ? "Saving..." : "Save"}
              className="btn-primary"
              disabled={!isDirty || isSaving}
              icon={
                isSaving ? (
                  <FaCircleNotch className="animate-spin" />
                ) : undefined
              }
              onClick={() => saveRoles()}
            />
          </div>
        </div>
      </Modal>

      <ConfirmationPromptDialog
        title="Delete Token"
        description="Are you sure you want to delete this token? This action cannot be undone."
        onConfirm={handleDeleteToken}
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        className="z-[9999]"
      />
    </>
  );
}
