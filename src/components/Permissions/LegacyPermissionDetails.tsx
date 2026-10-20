import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import { Modal } from "@flanksource-ui/ui/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { FaCircleNotch, FaTrash } from "react-icons/fa";
import { AuthorizationAccessCheck } from "./AuthorizationAccessCheck";

type LegacyPermissionDetailsProps = {
  title: string;
  record: { id?: string; source?: string } & Record<string, unknown>;
  // onDelete deletes the record. Only records created in the UI can be
  // deleted here: a Kubernetes resource is deleted with the resource.
  onDelete: (id: string) => Promise<unknown>;
  onClose: () => void;
};

// LegacyPermissionDetails shows a deprecated Permission or Permission Group
// read-only, with a way to delete it once it's been migrated.
export default function LegacyPermissionDetails({
  title,
  record,
  onDelete,
  onClose
}: LegacyPermissionDetailsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteRecord, isLoading: isDeleting } = useMutation({
    mutationFn: (id: string) => onDelete(id),
    onSuccess: () => {
      toastSuccess(`${title} deleted`);
      queryClient.invalidateQueries({ queryKey: ["legacy_permission_counts"] });
      onClose();
    },
    onError: (error: AxiosError) => toastError(error.message)
  });

  const fields = Object.fromEntries(
    Object.entries(record).filter(
      ([, value]) => value !== null && value !== undefined && value !== ""
    )
  );
  const isCRD = record.source?.toLowerCase().startsWith("kubernetes");

  return (
    <Modal
      title={title}
      open
      onClose={onClose}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <div className="flex flex-col gap-4 p-4">
        <JSONViewer
          code={JSON.stringify(fields, null, 2)}
          format="yaml"
          convertToYaml
        />
      </div>
      <div className="flex items-center justify-between bg-gray-100 px-5 py-4">
        <span className="text-sm text-gray-600">
          {isCRD
            ? "Defined as a Kubernetes resource: delete it there."
            : "Created in the UI."}
        </span>
        {!isCRD && record.id && (
          <AuthorizationAccessCheck
            resource={tables.role_bindings}
            action="delete"
          >
            <Button
              text="Delete"
              disabled={isDeleting}
              icon={
                isDeleting ? (
                  <FaCircleNotch className="animate-spin" />
                ) : (
                  <FaTrash />
                )
              }
              className="btn-danger"
              onClick={() => setIsConfirmOpen(true)}
            />
          </AuthorizationAccessCheck>
        )}
      </div>
      {isConfirmOpen && (
        <ConfirmationPromptDialog
          title={`Delete ${title}`}
          description="Make sure it's been recreated as a Role Binding. This can't be undone."
          onConfirm={() => {
            setIsConfirmOpen(false);
            deleteRecord(record.id!);
          }}
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          className="z-[9999]"
        />
      )}
    </Modal>
  );
}
