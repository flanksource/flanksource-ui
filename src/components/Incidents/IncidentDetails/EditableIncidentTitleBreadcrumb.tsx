import { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import { Incident } from "../../../api/types/incident";
import { IconButton } from "../../../ui/Buttons/IconButton";
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
    <div className="flex w-full flex-row items-center gap-2">
      <EditIncidentTitleForm
        incident={incident}
        updateHandler={updateHandler}
        setIsEditing={setIsEditing}
      />
    </div>
  ) : (
    <div className="flex flex-row items-center gap-2">
      <span>{incident.title}</span>
      <IconButton
        title="Edit"
        icon={<MdModeEditOutline />}
        onClick={() => setIsEditing(true)}
      />
    </div>
  );
}
