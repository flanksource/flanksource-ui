import { deleteConfigItemProperty } from "@flanksource-ui/api/services/configs";
import { Property } from "@flanksource-ui/api/types/topology";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { useUser } from "@flanksource-ui/context";
import { IconButton } from "@flanksource-ui/ui/Buttons/IconButton";
import { Modal } from "@flanksource-ui/ui/Modal";
import { FaTrash } from "react-icons/fa";

type Props = {
  configId: string;
  isOpen: boolean;
  onClose: () => void;
  onChanged?: (properties?: Property[]) => void;
  existingProperties?: Property[] | null;
};

export default function ManageConfigPropertiesModal({
  configId,
  isOpen,
  onClose,
  onChanged,
  existingProperties
}: Props) {
  const { user } = useUser();

  const userProperties =
    existingProperties?.filter(
      (property) =>
        property.creator_type === "person" && property.created_by === user?.id
    ) ?? [];

  const deleteProperty = async (property: Property) => {
    if (!user?.id) {
      toastError("Could not determine current user");
      return;
    }

    try {
      const result = await deleteConfigItemProperty(
        configId,
        "person",
        user.id,
        property.name
      );
      toastSuccess("Property deleted");
      onChanged?.(result?.properties);
    } catch (e) {
      toastError((e as Error).message);
    }
  };

  return (
    <Modal
      title="Delete Properties"
      size="very-small"
      open={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-2 p-2">
        {userProperties.length === 0 ? (
          <div className="text-sm text-gray-500">
            You have not added any manual properties.
          </div>
        ) : (
          userProperties.map((property) => (
            <div
              key={property.name}
              className="flex items-center justify-between rounded border border-gray-200 px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <div className="truncate font-medium text-gray-700">
                  {property.name}
                </div>
                <div className="truncate text-gray-500">
                  {String(property.text ?? property.value ?? "")}
                </div>
              </div>
              <IconButton
                aria-label={`Delete ${property.name}`}
                title="Delete property"
                className="text-gray-500 hover:text-red-600"
                icon={<FaTrash />}
                onClick={() => deleteProperty(property)}
              />
            </div>
          ))
        )}
      </div>
      <div className="flex items-center justify-end rounded-lg bg-gray-100 px-5 py-4">
        <button
          className="btn-secondary-base btn-secondary"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
