import { useMemo } from "react";
import { FaCircleNotch, FaTrash } from "react-icons/fa";
import { Age } from "@flanksource-ui/ui/Age";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteToken, Token } from "../../api/services/tokens";
import { Avatar } from "../../ui/Avatar";
import { Button } from "../../ui/Buttons/Button";
import { Modal } from "../../ui/Modal";
import { ConfirmationPromptDialog } from "../../ui/AlertDialog/ConfirmationPromptDialog";
import { toastError, toastSuccess } from "../Toast/toast";
import { useState } from "react";
import { useUser } from "@flanksource-ui/context";

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
  const { access } = useUser();
  const isAgent = token.person.type === "agent";
  const canDelete = !isAgent || access?.agent?.update === "all";

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
              Token Identity
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
              {isAgent ? "Agent Access" : "Limiting Roles"}
            </label>
            <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border bg-gray-50 p-3">
              {isAgent ? (
                <p className="text-sm text-gray-700">
                  Agent tokens do not use roles. Access is restricted to the
                  agent's own data and assigned work.
                </p>
              ) : token.roles?.length ? (
                token.roles.map((role) => (
                  <div
                    key={`${role.namespace}/${role.name}`}
                    className="break-all text-sm text-gray-700"
                  >
                    {role.namespace}/{role.name}
                  </div>
                ))
              ) : (
                <p className="text-sm text-orange-700">
                  No limiting roles. Personal tokens without roles are not
                  valid; create a replacement token.
                </p>
              )}
            </div>
            {!isAgent && (
              <p className="text-sm text-gray-500">
                Access is the intersection of the owner's current grants and
                these roles, not a fixed list of permissions. Missing or invalid
                roles grant nothing.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end bg-gray-100 px-6 py-4">
          {canDelete && (
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
          )}
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
