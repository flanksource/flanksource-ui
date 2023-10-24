import { useState } from "react";
import { BsPersonFill } from "react-icons/bs";
import { SiAutomattic } from "react-icons/si";
import { Evidence } from "../../../api/types/evidence";
import { Hypothesis } from "../../../api/types/hypothesis";
import { Modal } from "../../Modal";
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
          <div className="text-lg mb-4">
            What kind of definition of done would you like to add?
          </div>
          <button
            onClick={() => setSelectedDoDOption("Auto")}
            className="block space-x-2 rounded-md relative border p-4 cursor-pointer focus:outline-none bg-blue-50 border-blue-200"
          >
            <SiAutomattic className="inline" />
            <span>Automatic</span>
          </button>
          <button
            onClick={() => setSelectedDoDOption("Manual")}
            className="block space-x-2 rounded-md relative border p-4 cursor-pointer focus:outline-none bg-blue-50 border-blue-200"
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
