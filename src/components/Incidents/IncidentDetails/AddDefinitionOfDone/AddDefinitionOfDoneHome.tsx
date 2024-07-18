import { useState } from "react";
import { BsPersonFill } from "react-icons/bs";
import { SiAutomattic } from "react-icons/si";
import { Evidence } from "../../../../api/types/evidence";
import { Hypothesis } from "../../../../api/types/hypothesis";
import { Modal } from "../../../../ui/Modal";
import AddAutoDefinitionOfDoneStepper from "./AddAutoDefinitionOfDone";
import AddManualDefinitionOfDone from "./AddManualDefinitionOfDone";

type DefinitionOfDoneOptions = "Auto" | "Manual";

type AddDefinitionOfDoneStepperProps = {
  noneDODEvidence: Evidence[];
  onAddDefinitionOfDone: (evidence: Evidence[]) => void;
  onCancel: () => void;
  rootHypothesis: Hypothesis;
};

export function AddDefinitionOfDoneHome({
  noneDODEvidence,
  onAddDefinitionOfDone,
  onCancel,
  rootHypothesis
}: AddDefinitionOfDoneStepperProps) {
  const [selectedDoDOption, setSelectedDoDOption] =
    useState<DefinitionOfDoneOptions>();
  return (
    <div className="flex flex-col">
      {selectedDoDOption === "Auto" ? (
        <AddAutoDefinitionOfDoneStepper
          noneDODEvidences={noneDODEvidence}
          onAddDefinitionOfDone={onAddDefinitionOfDone}
          onCancel={onCancel}
          incidentId={rootHypothesis.incident_id}
        />
      ) : selectedDoDOption === "Manual" ? (
        <AddManualDefinitionOfDone
          hypothesisId={rootHypothesis.id}
          onSuccess={onCancel}
          incidentId={rootHypothesis.incident_id}
        />
      ) : (
        <div className="flex flex-col space-y-2 p-4">
          <div className="mb-4 text-lg">
            What kind of definition of done would you like to add?
          </div>
          <button
            onClick={() => setSelectedDoDOption("Auto")}
            className="relative block cursor-pointer space-x-2 rounded-md border border-blue-200 bg-blue-50 p-4 focus:outline-none"
          >
            <SiAutomattic className="inline" />
            <span>Automatic</span>
          </button>
          <button
            onClick={() => setSelectedDoDOption("Manual")}
            className="relative block cursor-pointer space-x-2 rounded-md border border-blue-200 bg-blue-50 p-4 focus:outline-none"
          >
            <BsPersonFill className="inline" />
            <span>Manual</span>
          </button>
        </div>
      )}
    </div>
  );
}

type AddDefinitionOfDoneModalProps = {
  isOpen: boolean;
  noneDODEvidence: Evidence[];
  onCloseModal: () => void;
  onAddDefinitionOfDone: () => void;
  rootHypothesis: Hypothesis;
};

export default function AddDefinitionOfDoneModal({
  isOpen,
  noneDODEvidence,
  onCloseModal,
  onAddDefinitionOfDone,
  rootHypothesis
}: AddDefinitionOfDoneModalProps) {
  return (
    <Modal
      title="Add Definition of Done"
      onClose={onCloseModal}
      open={isOpen}
      bodyClass=""
      size="full"
    >
      <AddDefinitionOfDoneHome
        noneDODEvidence={noneDODEvidence}
        onAddDefinitionOfDone={onAddDefinitionOfDone}
        onCancel={onCloseModal}
        rootHypothesis={rootHypothesis}
      />
    </Modal>
  );
}
