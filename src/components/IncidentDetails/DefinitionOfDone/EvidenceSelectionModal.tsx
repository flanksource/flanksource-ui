import clsx from "clsx";
import { useState } from "react";
import { Evidence } from "../../../api/services/evidence";
import { EvidenceItem } from "../../Hypothesis/EvidenceSection";
import { InfoMessage } from "../../InfoMessage";
import { Modal } from "../../Modal";
import MultiSelectList from "../../MultiSelectList/MultiSelectList";

type EvidenceSelectionModalProps = {
  title: string;
  open: boolean;
  evidences: Evidence[];
  className?: string;
  enableButtons: {
    cancel?: boolean;
    skip?: boolean;
    submit?: boolean;
  };
  actionHandler?: (
    actionType: "close" | "cancel" | "skip" | "submit",
    data?: any
  ) => void;
  helpHint?: string;
  noEvidencesMsg?: string;
  viewOnly?: boolean;
};

export default function EvidenceSelectionModal({
  title = "Add contributing factors to definition of done",
  open,
  evidences,
  className = "overflow-y-auto overflow-x-hidden mb-20",
  enableButtons = {
    cancel: true,
    submit: true
  },
  actionHandler = () => {},
  helpHint,
  noEvidencesMsg = "There are no evidences provided for this incident",
  viewOnly
}: EvidenceSelectionModalProps) {
  const [selectedEvidences, setSelectedEvidences] = useState<Evidence[]>([]);

  return (
    <Modal
      title={title}
      onClose={() => {
        setSelectedEvidences([]);
        actionHandler("close");
      }}
      open={open}
      bodyClass=""
    >
      <div className={className}>
        {helpHint && (
          <div className="flex py-4 px-4">
            <div className="text-sm text-gray-500">{helpHint}</div>
          </div>
        )}
        <div
          className="p-4 pt-0 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 16rem)" }}
        >
          <MultiSelectList
            viewOnly={viewOnly}
            options={evidences}
            onOptionSelect={(evidence) => {
              setSelectedEvidences((val) => {
                if (val.includes(evidence)) {
                  return val.filter((v) => v.id !== evidence.id);
                } else {
                  return [...val, evidence];
                }
              });
            }}
            selectedOptions={selectedEvidences}
            renderOption={(evidence, index) => {
              return (
                <div key={index} className="relative flex items-center">
                  <div className="min-w-0 flex-1 text-sm mr-4">
                    {evidence.description && (
                      <div className="text-gray-500 py-2 text-base">
                        {evidence.description}
                      </div>
                    )}
                    <EvidenceItem evidence={evidence} />
                  </div>
                </div>
              );
            }}
          />
        </div>
        {!Boolean(evidences.length) && (
          <div className="flex items-center justify-center py-5 px-5 h-56">
            <div className="text-sm text-gray-500">
              <InfoMessage message={noEvidencesMsg} />
            </div>
          </div>
        )}
      </div>
      {!viewOnly && (
        <div
          className={clsx(
            "flex rounded justify-between bg-gray-100 px-8 pb-4 items-end",
            "absolute w-full bottom-0 left-0"
          )}
        >
          <div className="flex flex-1">
            {enableButtons.cancel && (
              <button
                type="button"
                className={clsx("btn-secondary-base btn-secondary", "mt-4")}
                onClick={() => {
                  setSelectedEvidences([]);
                  actionHandler("cancel");
                }}
              >
                Cancel
              </button>
            )}
          </div>
          {Boolean(evidences.length) && (
            <div className="flex flex-1 justify-end">
              {enableButtons.skip && (
                <button
                  type="button"
                  className={clsx(
                    "btn-secondary-base btn-secondary",
                    "mt-4 mr-4"
                  )}
                  onClick={() => {
                    setSelectedEvidences([]);
                    actionHandler("skip");
                  }}
                >
                  Skip
                </button>
              )}
              {enableButtons.submit && (
                <button
                  type="submit"
                  className={clsx("btn-primary", "mt-4")}
                  onClick={() => {
                    actionHandler("submit", [...selectedEvidences]);
                    setSelectedEvidences([]);
                  }}
                >
                  Add
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
