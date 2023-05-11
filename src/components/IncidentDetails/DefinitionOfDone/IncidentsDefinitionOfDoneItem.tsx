import { Menu } from "../../Menu";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsHourglassSplit, BsTrash } from "react-icons/bs";
import { Evidence, EvidenceType } from "../../../api/services/evidence";
import { IconButton } from "../../IconButton";
import { EvidenceView } from "./EvidenceView";
import {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useCallback,
  useState
} from "react";
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
  incidentId: string;
};

export default function IncidentsDefinitionOfDoneItem({
  evidence,
  setEvidenceBeingRemoved,
  setOpenDeleteConfirmDialog,
  incidentId
}: Props) {
  const [isEditingDoDScriptModalOpen, setIsEditingDoDScriptModalOpen] =
    useState(false);

  const [isEditingDoDCommentModalOpen, setIsEditingDoDCommentModalOpen] =
    useState(false);

  const [isTogglingAsResolved, setIsTogglingAsResolved] = useState(false);

  const { isLoading, mutate } = useUpdateEvidenceMutation({}, incidentId);

  const [dropDownMenuStyles, setDropDownMenuStyles] = useState<CSSProperties>();

  const dropdownMenuStylesCalc = useCallback((node: HTMLDivElement) => {
    if (!node) {
      return;
    }
    const left = node.getBoundingClientRect().left;
    const top = node.getBoundingClientRect().bottom;

    if (left && top) {
      setDropDownMenuStyles({
        left: left - 200,
        top: top,
        position: "fixed",
        transform: "unset"
      });
      node.style.removeProperty("transform");
    }
  }, []);

  return (
    <>
      <div className="relative flex items-center">
        <div className="min-w-0 flex-1 text-sm">
          <EvidenceView evidence={evidence} size={Size.small} />
        </div>
        <div className="flex items-center">
          {isLoading ? (
            <MdRefresh className="animate-spin" />
          ) : evidence.done ? (
            <AiFillCheckCircle className="mr-1 fill-green-500" />
          ) : (
            <BsHourglassSplit className="mr-1" />
          )}
          <Menu>
            <div className="" ref={dropdownMenuStylesCalc}>
              <Menu.VerticalIconButton />
            </div>
            <Menu.Items className={`fixed z-50`} style={dropDownMenuStyles}>
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
          }}
          key={`script_${evidence.id}`}
          incidentId={incidentId}
        />
      ) : (
        <EditEvidenceDefinitionOfDoneComment
          evidence={evidence}
          isOpen={isEditingDoDCommentModalOpen}
          onCloseModal={() => setIsEditingDoDCommentModalOpen(false)}
          onSuccess={() => {
            setIsEditingDoDCommentModalOpen(false);
          }}
          key={`comment_${evidence.id}`}
          incidentId={incidentId}
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
