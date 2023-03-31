import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { Evidence, updateEvidence } from "../../../api/services/evidence";
import { ConfirmationPromptDialog } from "../../Dialogs/ConfirmationPromptDialog";
import EvidenceSelectionModal from "./EvidenceSelectionModal";
import IncidentsDefinitionOfDoneItem from "./IncidentsDefinitionOfDoneItem";
import AddDefinitionOfDoneModal from "../AddDefinitionOfDone/AddDefinitionOfDoneHome";
import CollapsiblePanel from "../../CollapsiblePanel";
import Title from "../../Title/title";
import { MdRefresh } from "react-icons/md";
import { RiFullscreenLine } from "react-icons/ri";
import { BsCardChecklist } from "react-icons/bs";
import { ClickableSvg } from "../../ClickableSvg/ClickableSvg";
import { Badge } from "../../Badge";
import { useIncidentState } from "../../../store/incident.state";

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
        <span className="ml-2 text-sm font-medium text-blue-600 group-hover:text-blue-500">
          Add definition of done
        </span>
      </button>
    </div>
  );
}

export function IncidentsDefinitionOfDone({
  incidentId
}: DefinitionOfDoneProps) {
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [evidenceBeingRemoved, setEvidenceBeingRemoved] = useState<Evidence>();
  const [dodEvidences, setDODEvidences] = useState<Evidence[]>([]);
  const [dodModalOpen, setDODModalOpen] = useState(false);
  const [addToDODModalOpen, setAddToDODModalOpen] = useState(false);
  const [nonDODEvidences, setNonDODEvidences] = useState<Evidence[]>([]);
  const { refetchIncident, isLoading, isRefetching, incident } =
    useIncidentState(incidentId);

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

  const rootHypothesis = useMemo(() => {
    return incident?.hypotheses.find(
      (hypothesis) => hypothesis.type === "root"
    );
  }, [incident?.hypotheses]);

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
      refetchIncident();
    });
  };

  return (
    <CollapsiblePanel
      Header={
        <div className="flex flex-row w-full items-center space-x-2">
          <Title
            title="Definition of done"
            icon={<BsCardChecklist className="w-6 h-6" />}
          />
          <Badge
            className="w-5 h-5 flex items-center justify-center"
            roundedClass="rounded-full"
            text={dodEvidences?.length ?? 0}
          />
          <div
            className="relative z-0 inline-flex justify-end ml-5"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ClickableSvg>
              <MdRefresh
                className={`cursor-pointer mr-3 w-6 h-6 inline-block ${
                  isRefetching ? "animate-spin" : ""
                }`}
                onClick={() => refetchIncident()}
              />
            </ClickableSvg>
            <ClickableSvg>
              <RiFullscreenLine
                className="cursor-pointer w-6 h-6 inline-block "
                onClick={() => setDODModalOpen(true)}
              />
            </ClickableSvg>
          </div>
        </div>
      }
    >
      <div className="flex flex-col">
        <div className="flex overflow-x-hidden w-full px-4 pb-6">
          <div className="w-full">
            {isLoading && !incident ? (
              <div className="flex items-start py-2 pl-2 pr-2">
                <div className="text-sm text-gray-500">
                  Loading evidences please wait...
                </div>
              </div>
            ) : (
              dodEvidences.map((evidence) => (
                <IncidentsDefinitionOfDoneItem
                  key={evidence.id}
                  evidence={evidence}
                  setEvidenceBeingRemoved={setEvidenceBeingRemoved}
                  setOpenDeleteConfirmDialog={setOpenDeleteConfirmDialog}
                  refetch={refetchIncident}
                />
              ))
            )}
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
        <ConfirmationPromptDialog
          isOpen={openDeleteConfirmDialog}
          title="Remove from definition of done ?"
          description="Are you sure you want to remove the evidence from definition of done ?"
          yesLabel="Remove"
          onClose={() => setOpenDeleteConfirmDialog(false)}
          onConfirm={() => {
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
          noEvidencesMsg="There are no evidences which are not part of definition of done"
        />
        <AddDefinitionOfDoneModal
          onCloseModal={() => setAddToDODModalOpen(false)}
          noneDODEvidence={nonDODEvidences}
          isOpen={addToDODModalOpen}
          onAddDefinitionOfDone={() => {
            refetchIncident();
            setAddToDODModalOpen(false);
          }}
          rootHypothesis={rootHypothesis!}
        />
      </div>
    </CollapsiblePanel>
  );
}
