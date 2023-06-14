import { FaCircleNotch, FaTrash } from "react-icons/fa";
import { Button } from "../../Button";
import { SchemaResourceType } from "../resourceTypes";
import { useCallback, useState } from "react";
import { ConfirmationPromptDialog } from "../../Dialogs/ConfirmationPromptDialog";
import { useSettingsDeleteResource } from "../../../api/query-hooks/mutations/useSettingsResourcesMutations";

type DeleteResourceProps = {
  resourceId: string;
  resourceInfo: Pick<SchemaResourceType, "table" | "name" | "api">;
  isModal?: boolean;
  onDeleted?: () => void;
};

export default function DeleteResource({
  resourceId,
  resourceInfo: { table, name: schemaResourceName, api },
  isModal = false,
  onDeleted = () => {}
}: DeleteResourceProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const { mutate: deleteResource, isLoading } = useSettingsDeleteResource(
    {
      table,
      name: schemaResourceName,
      api
    },
    isModal
  );

  const onDeleteResource = useCallback(() => {
    setIsConfirmDialogOpen(false);
    deleteResource(resourceId);
    onDeleted();
  }, [deleteResource, onDeleted, resourceId]);

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
