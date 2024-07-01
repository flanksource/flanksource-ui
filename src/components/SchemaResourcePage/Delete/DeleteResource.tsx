import { useSettingsDeleteResource } from "@flanksource-ui/api/query-hooks/mutations/useSettingsResourcesMutations";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useCallback, useState } from "react";
import { FaCircleNotch, FaTrash } from "react-icons/fa";
import { toastSuccess } from "../../Toast/toast";
import { SchemaResourceType } from "../resourceTypes";

type DeleteResourceProps = {
  resourceId: string;
  resourceInfo: Pick<SchemaResourceType, "table" | "name" | "api">;
  onDeleted?: () => void;
};

export default function DeleteResource({
  resourceId,
  resourceInfo: { table, name: schemaResourceName, api },
  onDeleted = () => {}
}: DeleteResourceProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { mutate: deleteResource, isLoading } = useSettingsDeleteResource(
    {
      table,
      name: schemaResourceName,
      api
    },
    {
      onSuccess: () => {
        toastSuccess(`${schemaResourceName} deleted successfully`);
        onDeleted();
      }
    }
  );

  const onDeleteResource = useCallback(() => {
    setIsConfirmDialogOpen(false);
    deleteResource(resourceId);
    onDeleted();
  }, [deleteResource, onDeleted, resourceId]);

  return (
    <>
      <AuthorizationAccessCheck resource={table} action="write">
        <Button
          text="Delete"
          disabled={isLoading}
          icon={
            !isLoading ? (
              <FaTrash />
            ) : (
              <FaCircleNotch className="animate-spin" />
            )
          }
          className="btn-danger"
          onClick={() => setIsConfirmDialogOpen(true)}
        />
      </AuthorizationAccessCheck>
      {isConfirmDialogOpen && (
        <ConfirmationPromptDialog
          title="Delete resource"
          description="Are you sure you want to delete this resource?"
          onConfirm={onDeleteResource}
          isOpen={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          className="z-[9999]"
        />
      )}
    </>
  );
}
