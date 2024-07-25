import { updateEvidence } from "@flanksource-ui/api/services/evidence";
import { Evidence } from "@flanksource-ui/api/types/evidence";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { CountBadge } from "@flanksource-ui/ui/Badge/CountBadge";
import { ClickableSvg } from "@flanksource-ui/ui/ClickableSvg/ClickableSvg";
import CollapsiblePanel from "@flanksource-ui/ui/CollapsiblePanel/CollapsiblePanel";
import { dateSortHelper } from "@flanksource-ui/utils/date";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { BsCardChecklist } from "react-icons/bs";
import { MdRefresh } from "react-icons/md";
import { RiFullscreenLine } from "react-icons/ri";
import { useIncidentState } from "../../../../store/incident.state";
import EmptyState from "../../../EmptyState";
import Title from "../../../Title/title";
import AddDefinitionOfDoneModal from "../AddDefinitionOfDone/AddDefinitionOfDoneHome";
import EvidenceSelectionModal from "./EvidenceSelectionModal";
import IncidentsDefinitionOfDoneItem from "./IncidentsDefinitionOfDoneItem";

type DefinitionOfDoneProps = React.HTMLProps<HTMLDivElement> & {
  incidentId: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

type AddDefinitionOfDoneProps = {
  onClick: () => void;
} & React.HTMLProps<HTMLDivElement>;

function AddDefinitionOfDone({ onClick, ...rest }: AddDefinitionOfDoneProps) {
  return (
    <div {...rest}>
      <button
        type="button"
        className="group flex items-center rounded-md bg-white"
        onClick={onClick}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400">
          <svg
            className="h-5 w-5"
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
  incidentId,
  className,
  isCollapsed,
  onCollapsedStateChange,
  ...props
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
    setDODEvidences(
      data
        .filter((evidence) => evidence.definition_of_done)
        .sort((a, b) => {
          return dateSortHelper("asc", a.created_at, b.created_at);
        })
    );
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
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <div className="flex w-full flex-row items-center space-x-2">
          <Title
            title="Definition of done"
            icon={<BsCardChecklist className="h-6 w-6" />}
          />
          <CountBadge
            roundedClass="rounded-full"
            value={dodEvidences?.length ?? 0}
          />
          <div
            className="relative z-0 ml-5 inline-flex justify-end"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ClickableSvg>
              <MdRefresh
                className={`mr-3 inline-block h-6 w-6 cursor-pointer ${
                  isRefetching ? "animate-spin" : ""
                }`}
                onClick={() => refetchIncident()}
              />
            </ClickableSvg>
            <ClickableSvg>
              <RiFullscreenLine
                className="inline-block h-6 w-6 cursor-pointer"
                onClick={() => setDODModalOpen(true)}
              />
            </ClickableSvg>
          </div>
        </div>
      }
      className={clsx(className)}
      childrenClassName=""
      {...props}
      dataCount={dodEvidences?.length}
    >
      <div className="flex flex-col">
        <div className="flex w-full overflow-x-hidden pb-6 pt-2">
          <div className="w-full space-y-1">
            {isLoading && !incident ? (
              <div className="flex items-start pl-2 pr-2">
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
                  incidentId={incidentId}
                />
              ))
            )}
            <AddDefinitionOfDone
              className={clsx(
                "flex items-center justify-between",
                dodEvidences.length ? "mb-4 py-2" : "py-4"
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
        {dodEvidences.length === 0 && !isLoading && <EmptyState />}
      </div>
    </CollapsiblePanel>
  );
}
