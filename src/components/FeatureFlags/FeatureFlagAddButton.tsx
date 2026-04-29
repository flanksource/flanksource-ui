import {
  DebugProperty,
  PropertyDBObject
} from "@flanksource-ui/services/permissions/permissionsService";
import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import FeatureFlagForm from "./FeatureFlagForm";

type FeatureFlagAddButtonProps = {
  onSubmit: (property: Partial<PropertyDBObject>) => void;
  onDelete: (property: Partial<PropertyDBObject>) => void;
  debugProperties?: Record<string, DebugProperty>;
};

export default function FeatureFlagAddButton({
  onSubmit,
  onDelete,
  debugProperties
}: FeatureFlagAddButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        key="add"
        type="button"
        className=""
        onClick={() => setIsOpen(true)}
      >
        <AiFillPlusCircle size={32} className="text-blue-600" />
      </button>
      <FeatureFlagForm
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onFeatureFlagSubmit={onSubmit}
        onFeatureFlagDelete={onDelete}
        debugProperties={debugProperties}
      />
    </>
  );
}
