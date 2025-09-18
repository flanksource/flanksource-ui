import { useMemo } from "react";
import { FaCircleNotch, FaTrash } from "react-icons/fa";
import { Age } from "@flanksource-ui/ui/Age";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteToken, Token } from "../../api/services/tokens";
import { getPermissions } from "../../api/services/rbac";
import { Avatar } from "../../ui/Avatar";
import { Button } from "../../ui/Buttons/Button";
import { Modal } from "../../ui/Modal";
import { ConfirmationPromptDialog } from "../../ui/AlertDialog/ConfirmationPromptDialog";
import { toastError, toastSuccess } from "../Toast/toast";
import { useState } from "react";
import { getAllObjectActions } from "./tokenUtils";

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

  const { data: tokenPermissions = [] } = useQuery({
    queryKey: ["permissions", token.id],
    queryFn: () => getPermissions(token.id),
    enabled: isOpen
  });

  const availablePermissions = useMemo(() => {
    const allObjectActions = getAllObjectActions();
    const deniedPermissions = new Set(
      tokenPermissions
        .filter(
          (permission) => permission.deny || permission.subject !== token.id
        )
        .map((permission) => `${permission.object}:${permission.action}`)
    );

    return allObjectActions.filter(
      (objectAction) => !deniedPermissions.has(objectAction)
    );
  }, [tokenPermissions, token.id]);

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
              Created By
            </label>
            <div className="flex items-center space-x-3">
              <Avatar
                user={{
                  name: token.person.name,
                  avatar: token.person.avatar
                }}
                size="sm"
              />
              <span className="text-sm text-gray-900">{token.person.name}</span>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Created At
            </label>
            <Age from={formattedCreatedAt} />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Token Permissions
            </label>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border bg-gray-50 p-3">
              {availablePermissions.map((permissionKey) => (
                <div key={permissionKey} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-60"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    {permissionKey}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end bg-gray-100 px-6 py-4">
          <Button
            text="Delete"
            disabled={isDeleting}
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
