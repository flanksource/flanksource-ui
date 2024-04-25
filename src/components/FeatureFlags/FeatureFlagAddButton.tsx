import { PropertyDBObject } from "@flanksource-ui/services/permissions/permissionsService";
import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import FeatureFlagForm from "./FeatureFlagForm";

type FeatureFlagAddButtonProps = {
  onSubmit: (property: Partial<PropertyDBObject>) => void;
  onDelete: (property: Partial<PropertyDBObject>) => void;
};

export default function FeatureFlagAddButton({
  onSubmit,
  onDelete
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
      />
    </>
  );
}
