import clsx from "clsx";
import { useEffect, useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsHourglassSplit, BsTrash } from "react-icons/bs";
import { MdRefresh } from "react-icons/md";
import { RiFullscreenLine } from "react-icons/ri";
import { Evidence, updateEvidence } from "../../../api/services/evidence";
import { Size } from "../../../types";
import { DeleteConfirmDialog } from "../../DeleteConfirmDialog";
import { IconButton } from "../../IconButton";
import { Menu } from "../../Menu";
import { useIncidentQuery } from "../../../api/query-hooks";
import { EvidenceView } from "./EvidenceView";
import EvidenceSelectionModal from "./EvidenceSelectionModal";
import { toastError } from "../../Toast/toast";

type DefinitionOfDoneProps = {
  incidentId: string;
};

type AddDefinitionOfDoneProps = {
  onClick: () => void;
} & React.HTMLProps<HTMLDivElement>;

function AddDefinitionOfDone({ onClick, ...rest }: AddDefinitionOfDoneProps) {
  return (
    <div {...rest}>
      <button
        type="button"
        className="flex items-center bg-white rounded-md group"
        onClick={onClick}
      >
        <span className="flex items-center justify-center w-5 h-5 text-gray-400 border-2 border-gray-300 border-dashed rounded-full">
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </span>
        <span className="ml-3 text-sm font-medium text-blue-600 group-hover:text-blue-500">
          Add definition of done
        </span>
      </button>
    </div>
  );
}

export function DefinitionOfDone({ incidentId }: DefinitionOfDoneProps) {
  const [size] = useState<Size>(Size.small);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [evidenceBeingRemoved, setEvidenceBeingRemoved] = useState<Evidence>();
  const [dodEvidences, setDODEvidences] = useState<Evidence[]>([]);
  const [dodModalOpen, setDODModalOpen] = useState(false);
  const [addToDODModalOpen, setAddToDODModalOpen] = useState(false);
  const [nonDODEvidences, setNonDODEvidences] = useState<Evidence[]>([]);
  const incidentQuery = useIncidentQuery(incidentId);
  const { refetch, isRefetching, isLoading, data: incident } = incidentQuery;

  useEffect(() => {
    if (!incident) {
      setDODEvidences([]);
      return;
    }
    const data: Evidence[] = [];
    incident.hypotheses.forEach((hypothesis) => {
      hypothesis?.evidences?.forEach((evidence: Evidence) => {
        data.push(evidence);
      });
    });
    setNonDODEvidences(data.filter((evidence) => !evidence.definition_of_done));
    setDODEvidences(data.filter((evidence) => evidence.definition_of_done));
  }, [incident]);

  const initiateDeleteEvidenceFromDOD = async () => {
    if (!evidenceBeingRemoved) {
      return;
    }
    setOpenDeleteConfirmDialog(false);
    await removeEvidenceFromDOD(evidenceBeingRemoved);
  };

  const removeEvidenceFromDOD = (evidence: Evidence) => {
    return updateEvidence(evidence.id, {
      definition_of_done: false
    }).then(() => {
      refetch();
    });
  };

  const blukAddEvidencesToDOD = async (selectedEvidences: Evidence[]) => {
    for (const element of selectedEvidences) {
      try {
        await updateEvidence(element.id, {
          definition_of_done: true
        });
      } catch (ex) {}
    }
    refetch();
  };

  return (
    <div className="w-full">
      <div className="py-4 border-b border-gray-200">
        <div className="px-4 flex justify-between">
          <h2 className="mt-0.5 text-2xl font-medium leading-7 text-dark-gray">
            Definition of done
          </h2>
          <span className="relative z-0 inline-flex">
            <MdRefresh
              className="cursor-pointer mr-3 w-6 h-6"
              onClick={() => refetch()}
            />
            <RiFullscreenLine
              className="cursor-pointer w-5 h-5"
              onClick={() => setDODModalOpen(true)}
            />
          </span>
        </div>
      </div>
      <div className="flex max-h-96 overflow-y-auto overflow-x-hidden w-full px-4">
        <div className="w-full">
          {(isLoading || isRefetching) && (
            <div className="flex items-start py-2 pl-2 pr-2">
              <div className="text-sm text-gray-500">
                Loading evidences please wait...
              </div>
            </div>
          )}
          {!(isLoading || isRefetching) &&
            dodEvidences.map((evidence, index) => {
              return (
                <div key={index} className="relative flex items-center py-2">
                  {evidence.done ? (
                    <AiFillCheckCircle className="mr-1" />
                  ) : (
                    <BsHourglassSplit className="mr-1" />
                  )}
                  <div className="min-w-0 flex-1 text-sm">
                    <EvidenceView evidence={evidence} size={size} />
                  </div>
                  <div className="flex items-center">
                    <Menu>
                      <Menu.VerticalIconButton />
                      <Menu.Items widthClass="w-72">
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
                              icon={
                                <BsTrash
                                  className="text-gray-600 border-0 border-l-1 border-gray-200"
                                  size={18}
                                />
                              }
                            />
                            <span className="pl-2 text-sm block cursor-pionter">
                              Remove from Definition of done
                            </span>
                          </div>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                </div>
              );
            })}
          <AddDefinitionOfDone
            className={clsx(
              "flex items-center justify-between",
              dodEvidences.length ? "py-2 mb-4" : "py-4"
            )}
            onClick={() => {
              setAddToDODModalOpen(true);
            }}
          />
        </div>
      </div>
      <DeleteConfirmDialog
        isOpen={openDeleteConfirmDialog}
        title="Remove from definition of done ?"
        description="Are you sure you want to remove the evidence from definition of done ?"
        deleteLabel="Remove"
        onClose={() => setOpenDeleteConfirmDialog(false)}
        onDelete={() => {
          initiateDeleteEvidenceFromDOD();
        }}
      />
      <EvidenceSelectionModal
        title="Definition of done evidences"
        evidences={dodEvidences}
        open={dodModalOpen}
        viewOnly
        enableButtons={{}}
        className="overflow-y-auto overflow-x-hidden"
        actionHandler={(actionType, data) => {
          if (actionType === "close") {
            setDODModalOpen(false);
          }
        }}
        noEvidencesMsg="There are no evidences which are not part of defintion of done"
      />
      <EvidenceSelectionModal
        title="Add to Definition of done"
        evidences={nonDODEvidences}
        open={addToDODModalOpen}
        actionHandler={(actionType, data) => {
          if (actionType === "close") {
            setAddToDODModalOpen(false);
          } else if (actionType === "cancel") {
            setAddToDODModalOpen(false);
          } else if (actionType === "submit") {
            if (data.length) {
              blukAddEvidencesToDOD(data);
              setAddToDODModalOpen(false);
            } else {
              toastError("Please select at least one evidence");
            }
          }
        }}
        enableButtons={{
          cancel: true,
          submit: true
        }}
        helpHint="Select an item to be included in the definition of done"
        noEvidencesMsg="There are no evidences which are not part of defintion of done"
      />
    </div>
  );
}
