import { Menu } from "../../Menu";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsHourglassSplit, BsTrash } from "react-icons/bs";
import { Evidence, EvidenceType } from "../../../api/services/evidence";
import { IconButton } from "../../IconButton";
import { EvidenceView } from "./EvidenceView";
import { Dispatch, SetStateAction, useState } from "react";
import { Size } from "../../../types";
import { FaEdit } from "react-icons/fa";
import EditEvidenceDefinitionOfDoneScript from "./EditEvidenceDefinitionOfDoneScript";
import EditEvidenceDefinitionOfDoneComment from "./EditEvidenceDefinitionOfDoneComment";
import { ConfirmationPromptDialog } from "../../Dialogs/ConfirmationPromptDialog";
import { useUpdateEvidenceMutation } from "../../../api/query-hooks/mutations/evidence";
import { MdRefresh } from "react-icons/md";

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

  const [isEditingDoDCommentModalOpen, setIsEditingDoDCommentModalOpen] =
    useState(false);

  const [isTogglingAsResolved, setIsTogglingAsResolved] = useState(false);

  const { isLoading, mutate } = useUpdateEvidenceMutation({
    onSuccess: () => refetch()
  });

  return (
    <>
      <div className="relative flex items-center py-2">
        {isLoading ? (
          <MdRefresh className="animate-spin" />
        ) : evidence.done ? (
          <AiFillCheckCircle className="mr-1 fill-green-500" />
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
                  if (evidence.type === EvidenceType.Comment) {
                    setIsEditingDoDCommentModalOpen(true);
                  } else {
                    setIsEditingDoDScriptModalOpen(true);
                  }
                }}
              >
                <div className="cursor-pointer flex w-full">
                  <FaEdit />
                  <span className="pl-2 text-sm block cursor-pointer">
                    Edit
                  </span>
                </div>
              </Menu.Item>
              {evidence.type === EvidenceType.Comment && (
                <Menu.Item onClick={() => setIsTogglingAsResolved(true)}>
                  <div className="cursor-pointer flex w-full">
                    <IconButton
                      className="bg-transparent flex items-center"
                      ovalProps={{
                        stroke: "blue",
                        height: "18px",
                        width: "18px",
                        fill: "transparent"
                      }}
                      icon={
                        evidence.done ? (
                          <BsHourglassSplit />
                        ) : (
                          <AiFillCheckCircle className="fill-green-500" />
                        )
                      }
                    />
                    <span className="pl-2 text-sm block cursor-pointer">
                      Mark as {evidence.done ? "not resolved" : "resolved"}
                    </span>
                  </div>
                </Menu.Item>
              )}

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
      {evidence.type !== EvidenceType.Comment ? (
        <EditEvidenceDefinitionOfDoneScript
          evidence={evidence}
          isOpen={isEditingDoDScriptModalOpen}
          onCloseModal={() => setIsEditingDoDScriptModalOpen(false)}
          onSuccess={() => {
            setIsEditingDoDScriptModalOpen(false);
            refetch();
          }}
          key={`script_${evidence.id}`}
        />
      ) : (
        <EditEvidenceDefinitionOfDoneComment
          evidence={evidence}
          isOpen={isEditingDoDCommentModalOpen}
          onCloseModal={() => setIsEditingDoDCommentModalOpen(false)}
          onSuccess={() => {
            setIsEditingDoDCommentModalOpen(false);
            refetch();
          }}
          key={`comment_${evidence.id}`}
        />
      )}

      <ConfirmationPromptDialog
        isOpen={isTogglingAsResolved}
        title={`Mark as ${evidence.done ? "not resolved" : "resolved"}`}
        description={`Are you sure you want to mark the definition of done as ${
          evidence.done ? "not resolved" : "resolved"
        }?`}
        yesLabel={`Mark as ${evidence.done ? "not resolved" : "resolved"}`}
        onClose={() => setIsTogglingAsResolved(false)}
        onConfirm={() => {
          mutate([
            {
              id: evidence.id,
              done: !evidence.done
            }
          ]);
          setIsTogglingAsResolved(false);
        }}
      />
    </>
  );
}
