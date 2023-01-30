import { Menu } from "../../Menu";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsHourglassSplit, BsTrash } from "react-icons/bs";
import { Evidence } from "../../../api/services/evidence";
import { IconButton } from "../../IconButton";
import { EvidenceView } from "./EvidenceView";
import { Dispatch, SetStateAction, useState } from "react";
import { Size } from "../../../types";
import { FaEdit } from "react-icons/fa";
import EditEvidenceDefinitionOfDoneScript from "./EditEvidenceDefinitionOfDoneScript";

type Props = {
  evidence: Evidence;
  setOpenDeleteConfirmDialog: Dispatch<SetStateAction<boolean>>;
  setEvidenceBeingRemoved: Dispatch<SetStateAction<Evidence | undefined>>;
  refetch: () => void;
};

export default function IncidentsDefinitionOfDoneItem({
  evidence,
  setEvidenceBeingRemoved,
  setOpenDeleteConfirmDialog,
  refetch
}: Props) {
  const [isEditingDoDScriptModalOpen, setIsEditingDoDScriptModalOpen] =
    useState(false);

  return (
    <>
      <div className="relative flex items-center py-2">
        {evidence.done ? (
          <AiFillCheckCircle className="mr-1" />
        ) : (
          <BsHourglassSplit className="mr-1" />
        )}
        <div className="min-w-0 flex-1 text-sm ml-2">
          <EvidenceView evidence={evidence} size={Size.small} />
        </div>
        <div className="flex items-center">
          <Menu>
            <Menu.VerticalIconButton />
            <Menu.Items widthClass="w-72">
              <Menu.Item
                onClick={(e: any) => {
                  setIsEditingDoDScriptModalOpen(true);
                }}
              >
                <div className="cursor-pointer flex w-full">
                  <FaEdit />
                  <span className="pl-2 text-sm block cursor-pointer">
                    Edit
                  </span>
                </div>
              </Menu.Item>
              <Menu.Item
                onClick={(e: any) => {
                  setOpenDeleteConfirmDialog(true);
                  setEvidenceBeingRemoved(evidence);
                }}
              >
                <div className="cursor-pointer flex w-full">
                  <IconButton
                    className="bg-transparent flex items-center"
                    ovalProps={{
                      stroke: "blue",
                      height: "18px",
                      width: "18px",
                      fill: "transparent"
                    }}
                    icon={<BsTrash />}
                  />
                  <span className="pl-2 text-sm block cursor-pointer">
                    Remove
                  </span>
                </div>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <EditEvidenceDefinitionOfDoneScript
        evidence={evidence}
        isOpen={isEditingDoDScriptModalOpen}
        onCloseModal={() => setIsEditingDoDScriptModalOpen(false)}
        onSuccess={() => {
          setIsEditingDoDScriptModalOpen(false);
          refetch();
        }}
        key={evidence.id}
      />
    </>
  );
}
