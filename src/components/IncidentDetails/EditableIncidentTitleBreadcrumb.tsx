import { useState } from "react";
import { Incident } from "../../api/services/incident";
import { IconButton } from "../IconButton";
import { MdModeEditOutline } from "react-icons/md";
import { TextInput } from "../TextInput";
import { EditIncidentTitleForm } from "./EditIncidentTitleForm";

type EditableIncidentTitleBreadcrumbProps = {
  incident: Pick<Incident, "title">;
  updateHandler: (incident: Partial<Incident>) => void;
};

export default function EditableIncidentTitleBreadcrumb({
  incident,
  updateHandler
}: EditableIncidentTitleBreadcrumbProps) {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <div className="flex flex-row w-full gap-2 items-center">
      <EditIncidentTitleForm
        incident={incident}
        updateHandler={updateHandler}
        setIsEditing={setIsEditing}
      />
    </div>
  ) : (
    <div className="flex flex-row gap-2 items-center">
      <span>{incident.title}</span>
      <IconButton
        title="Edit"
        icon={<MdModeEditOutline />}
        onClick={() => setIsEditing(true)}
      />
    </div>
  );
}
