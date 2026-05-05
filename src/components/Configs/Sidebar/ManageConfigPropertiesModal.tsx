import {
  ConfigPropertyRow,
  configPropertyRowToProperty,
  deleteConfigItemProperty,
  getManualConfigItemProperties,
  updateConfigItemProperty
} from "@flanksource-ui/api/services/configs";
import { Property } from "@flanksource-ui/api/types/topology";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { useUser } from "@flanksource-ui/context";
import { IconButton } from "@flanksource-ui/ui/Buttons/IconButton";
import { Modal } from "@flanksource-ui/ui/Modal";
import { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";

type Props = {
  configId: string;
  isOpen: boolean;
  onClose: () => void;
  onChanged?: (properties?: Property[]) => void;
};

export default function ManageConfigPropertiesModal({
  configId,
  isOpen,
  onClose,
  onChanged
}: Props) {
  const { user } = useUser();
  const [userProperties, setUserProperties] = useState<ConfigPropertyRow[]>([]);
  const [editingPropertyId, setEditingPropertyId] = useState<string>();
  const [draftProperty, setDraftProperty] = useState({
    name: "",
    text: "",
    value: "",
    link_url: "",
    link_label: ""
  });

  useEffect(() => {
    if (!isOpen || !user?.id) {
      setUserProperties([]);
      return;
    }

    getManualConfigItemProperties(configId, user.id)
      .then(setUserProperties)
      .catch((e) => toastError((e as Error).message));
  }, [configId, isOpen, user?.id]);

  const startEditing = (property: ConfigPropertyRow) => {
    setEditingPropertyId(property.id);
    setDraftProperty({
      name: property.name,
      text: property.text ?? "",
      value: property.value?.toString() ?? "",
      link_url: property.link_url ?? "",
      link_label: property.link_label ?? ""
    });
  };

  const updateProperty = async (property: ConfigPropertyRow) => {
    if (!property.id || !user?.id) {
      toastError("Could not determine property id or current user");
      return;
    }

    if (!draftProperty.name) {
      toastError("Please provide property name");
      return;
    }

    if (!draftProperty.text && draftProperty.value === "") {
      toastError("Please provide property text or value");
      return;
    }

    const nextProperty: ConfigPropertyRow = {
      ...property,
      name: draftProperty.name,
      text: draftProperty.value === "" ? draftProperty.text : undefined,
      value:
        draftProperty.value === "" ? undefined : Number(draftProperty.value),
      link_url: draftProperty.link_url || undefined,
      link_label: draftProperty.link_label || undefined
    };

    try {
      const result = await updateConfigItemProperty(
        property.id,
        configId,
        user.id,
        configPropertyRowToProperty(nextProperty)
      );
      setUserProperties((properties) =>
        properties.map((item) =>
          item.id === property.id ? nextProperty : item
        )
      );
      setEditingPropertyId(undefined);
      toastSuccess("Property updated");
      onChanged?.(result?.properties);
    } catch (e) {
      toastError((e as Error).message);
    }
  };

  const deleteProperty = async (property: ConfigPropertyRow) => {
    if (!property.id) {
      toastError("Could not determine property id");
      return;
    }

    try {
      const result = await deleteConfigItemProperty(configId, property.id);
      setUserProperties((properties) =>
        properties.filter((item) => item.id !== property.id)
      );
      toastSuccess("Property deleted");
      onChanged?.(result?.properties);
    } catch (e) {
      toastError((e as Error).message);
    }
  };

  return (
    <Modal
      title="Manage Properties"
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
          userProperties.map((property) => {
            const isEditing = editingPropertyId === property.id;

            return (
              <div
                key={property.id ?? property.name}
                className="flex items-center justify-between gap-2 rounded border border-gray-200 px-3 py-2 text-sm"
              >
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <input
                        className="form-input rounded border-gray-300 text-sm"
                        value={draftProperty.name}
                        onChange={(e) =>
                          setDraftProperty((draft) => ({
                            ...draft,
                            name: e.target.value
                          }))
                        }
                        placeholder="Name"
                      />
                      <input
                        className="form-input rounded border-gray-300 text-sm"
                        value={draftProperty.text}
                        onChange={(e) =>
                          setDraftProperty((draft) => ({
                            ...draft,
                            text: e.target.value,
                            value: ""
                          }))
                        }
                        placeholder="Text"
                      />
                      <input
                        className="form-input rounded border-gray-300 text-sm"
                        type="number"
                        value={draftProperty.value}
                        onChange={(e) =>
                          setDraftProperty((draft) => ({
                            ...draft,
                            value: e.target.value,
                            text: ""
                          }))
                        }
                        placeholder="Value"
                      />
                      <input
                        className="form-input rounded border-gray-300 text-sm"
                        value={draftProperty.link_url}
                        onChange={(e) =>
                          setDraftProperty((draft) => ({
                            ...draft,
                            link_url: e.target.value
                          }))
                        }
                        placeholder="Link URL"
                      />
                      <input
                        className="form-input rounded border-gray-300 text-sm"
                        value={draftProperty.link_label}
                        onChange={(e) =>
                          setDraftProperty((draft) => ({
                            ...draft,
                            link_label: e.target.value
                          }))
                        }
                        placeholder="Link label"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="truncate font-medium text-gray-700">
                        {property.name}
                      </div>
                      <div className="truncate text-gray-500">
                        {String(property.text ?? property.value ?? "")}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {isEditing ? (
                    <>
                      <IconButton
                        aria-label={`Save ${property.name}`}
                        title="Save property"
                        className="text-gray-500 hover:text-green-600"
                        icon={<FaSave />}
                        onClick={() => updateProperty(property)}
                      />
                      <IconButton
                        aria-label="Cancel edit"
                        title="Cancel edit"
                        className="text-gray-500"
                        icon={<FaTimes />}
                        onClick={() => setEditingPropertyId(undefined)}
                      />
                    </>
                  ) : (
                    <IconButton
                      aria-label={`Edit ${property.name}`}
                      title="Edit property"
                      className="text-gray-500"
                      icon={<FaEdit />}
                      onClick={() => startEditing(property)}
                    />
                  )}
                  <IconButton
                    aria-label={`Delete ${property.name}`}
                    title="Delete property"
                    className="text-gray-500 hover:text-red-600"
                    icon={<FaTrash />}
                    onClick={() => deleteProperty(property)}
                  />
                </div>
              </div>
            );
          })
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
