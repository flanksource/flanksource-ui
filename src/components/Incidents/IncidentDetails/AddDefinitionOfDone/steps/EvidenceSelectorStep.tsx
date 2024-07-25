import { ChangeEvent, useCallback, useMemo } from "react";
import { Evidence, EvidenceType } from "../../../../../api/types/evidence";
import MultiSelectList from "../../../../MultiSelectList/MultiSelectList";
import { EvidenceItem } from "../../../Hypothesis/EvidenceSection";
import {
  Action,
  SelectDefinitionOfDoneState
} from "../AddAutoDefinitionOfDone";

type EvidenceGroupSelectorStepProps = {
  noneDODEvidences: Evidence[];
  onSelectEvidence: (evidence: Evidence[]) => void;
  evidenceType: EvidenceType;
  selectedEvidences: Evidence[];
};

export function EvidenceGroupSelectorStep({
  onSelectEvidence,
  noneDODEvidences,
  selectedEvidences,
  evidenceType
}: EvidenceGroupSelectorStepProps) {
  const noneDODEvidencesFilteredByType = useMemo(
    () => noneDODEvidences.filter((evidence) => evidence.type === evidenceType),
    [noneDODEvidences, evidenceType]
  );

  const isAllSelected = useMemo(() => {
    return noneDODEvidencesFilteredByType.every((evidence) =>
      selectedEvidences.some(
        (selectedEvidence) => selectedEvidence.id === evidence.id
      )
    );
  }, [noneDODEvidencesFilteredByType, selectedEvidences]);

  const onSelectAllCheckboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        // Select all evidences of this type
        onSelectEvidence(noneDODEvidencesFilteredByType);
      } else {
        // Unselect all evidences of this type
        onSelectEvidence([]);
      }
    },
    [noneDODEvidencesFilteredByType, onSelectEvidence]
  );

  const onSelectSingleEvidenceCheckboxChange = useCallback(
    (selected: boolean, evidence: Evidence) => {
      const selectedEvidencesForType = selectedEvidences.filter(
        (evidence) => evidence.type === evidenceType
      );
      if (selected) {
        // Select evidence
        onSelectEvidence([...selectedEvidencesForType, evidence]);
      } else {
        // Unselect evidence
        onSelectEvidence(
          selectedEvidencesForType.filter((e) => e.id !== evidence.id)
        );
      }
    },
    [evidenceType, onSelectEvidence, selectedEvidences]
  );

  const isSelected = useCallback(
    (evidenceId: string) => {
      return selectedEvidences.some((evidence) => evidence.id === evidenceId);
    },
    [selectedEvidences]
  );

  if (noneDODEvidencesFilteredByType.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-col space-y-4 rounded-md border p-4 ${
        isAllSelected ? "border-blue-200" : "border-gray-300"
      }`}
    >
      <div className="flex flex-row items-center space-x-4">
        <input
          onChange={onSelectAllCheckboxChange}
          id={`selectAll${evidenceType}`}
          type="checkbox"
          /* this might not work */
          checked={isAllSelected}
          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor={`selectAll${evidenceType}`}
          className="font-semibold capitalize"
        >
          {evidenceType}
        </label>
      </div>
      <div className="ml-4 flex flex-col space-y-2">
        <MultiSelectList
          options={noneDODEvidencesFilteredByType}
          onOptionSelect={(evidence) => {
            onSelectSingleEvidenceCheckboxChange(
              !isSelected(evidence.id),
              evidence
            );
          }}
          selectedOptions={selectedEvidences}
          renderOption={(evidence, index) => {
            return (
              <div key={index} className="relative flex items-center">
                <div className="mr-4 min-w-0 flex-1 text-sm">
                  {evidence.description && (
                    <div className="py-2 text-base text-gray-500">
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
    </div>
  );
}

type EvidenceSelectorStepProps = {
  noneDODEvidences: Evidence[];
  dispatch: React.Dispatch<Action>;
  state: SelectDefinitionOfDoneState;
};
export default function EvidenceSelectorStep({
  noneDODEvidences,
  dispatch,
  state
}: EvidenceSelectorStepProps) {
  return (
    <div className="flex w-full flex-col space-y-4">
      {Object.entries(EvidenceType)
        // remove comment evidence, as they are Manual DoD
        .filter(([_, value]) => value !== EvidenceType.Comment)
        .map(([_, value], index) => (
          <EvidenceGroupSelectorStep
            noneDODEvidences={noneDODEvidences}
            onSelectEvidence={(evidence) => {
              dispatch({
                type: "selectEvidence",
                value: evidence,
                evidenceType: value
              });
            }}
            evidenceType={value as EvidenceType}
            selectedEvidences={state.selectedEvidence}
            key={index}
          />
        ))}
    </div>
  );
}
