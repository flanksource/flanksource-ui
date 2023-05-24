import { useMemo, useReducer } from "react";
import { useUpdateEvidenceMutation } from "../../../api/query-hooks/mutations/evidence";
import { Evidence, EvidenceType } from "../../../api/services/evidence";
import { ScriptStep } from "./steps/ScriptStep";
import EvidenceSelectorStep from "./steps/EvidenceSelectorStep";

export type DefinitionOfDoneType = `${EvidenceType}`;

type SelectEvidenceAction = {
  type: "selectEvidence";
  // no items selected, so we can reset the state
  value: Evidence[];
  evidenceType?: EvidenceType;
};

type ActionsReset = {
  type: "reset";
};

type MoveToAddScriptAction = {
  type: "addScriptPage";
};

type SubmitScriptAction = {
  type: "setScript";
  script?: string;
};

export type Action =
  | SelectEvidenceAction
  | MoveToAddScriptAction
  | ActionsReset
  | SubmitScriptAction;

// TODO: Type This More Accurately, i.e. when current step is addScript, then
// evidenceType is required and selectedEvidence is required and script is not
// available
export type SelectDefinitionOfDoneState = {
  currentStep: "selectEvidence" | "addScript";
  evidenceType?: EvidenceType;
  selectedEvidence: Evidence[];
  script?: string;
  comment?: string;
};

function addDefinitionOfDoneStepsReducer(
  state: SelectDefinitionOfDoneState,
  action: Action
): SelectDefinitionOfDoneState {
  switch (action.type) {
    case "selectEvidence":
      return {
        ...state,
        currentStep: "selectEvidence",
        evidenceType: action.evidenceType,
        selectedEvidence: action.value
      };

    case "addScriptPage":
      return {
        ...state,
        currentStep: "addScript",
        script:
          state.evidenceType === EvidenceType.Check &&
          state.script === undefined
            ? `check.status == "healthy" && check.age > duration("5m")`
            : undefined
      };

    case "setScript":
      return {
        ...state,
        script: action.script
      };

    case "reset":
      return {
        currentStep: "selectEvidence",
        evidenceType: undefined,
        selectedEvidence: []
      };

    default:
      throw new Error();
  }
}

type Props = {
  noneDODEvidences: Evidence[];
  onAddDefinitionOfDone: (evidence: Evidence[]) => void;
  onCancel: () => void;
  incidentId: string;
};

export default function AddAutoDefinitionOfDoneStepper({
  noneDODEvidences,
  onAddDefinitionOfDone,
  incidentId
}: Props) {
  const [selectDODState, dispatch] = useReducer(
    addDefinitionOfDoneStepsReducer,
    {
      selectedEvidence: [],
      currentStep: "selectEvidence"
    }
  );

  const { isLoading, mutate: updateEvidence } = useUpdateEvidenceMutation(
    {
      onSuccess: (evidence) => {
        onAddDefinitionOfDone(evidence);
      }
    },
    incidentId
  );

  const isAddButtonDisabled = useMemo(() => {
    if (selectDODState.currentStep === "selectEvidence") {
      return selectDODState.selectedEvidence.length === 0;
    }
    return false;
  }, [selectDODState]);

  return (
    <>
      <div className="w-full flex flex-col space-y-4 p-4 overflow-x-hidden">
        {/* title */}
        <div className="w-full flex flex-row space-y-2">
          <div className="flex flex-col flex-1 space-y-2">
            <h3 className="font-semibold text-gray-900">
              {selectDODState.currentStep === "selectEvidence"
                ? "Select item to be used for the definition of done"
                : "Define done using a CEL expression:"}
            </h3>
          </div>
        </div>
        <div className="w-full flex flex-col space-y-4">
          <div className="w-full flex flex-col space-y-4">
            {selectDODState.currentStep === "selectEvidence" ? (
              <EvidenceSelectorStep
                state={selectDODState}
                dispatch={dispatch}
                noneDODEvidences={noneDODEvidences}
              />
            ) : (
              <ScriptStep
                value={selectDODState.script}
                onChange={(value) =>
                  dispatch({ type: "setScript", script: value })
                }
                evidenceType={selectDODState.evidenceType!}
              />
            )}
          </div>
        </div>
      </div>
      <div className={`flex p-4 justify-end w-full`}>
        <button
          disabled={isAddButtonDisabled}
          className="px-4 py-2 btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
          type="button"
          onClick={async () => {
            if (selectDODState.currentStep === "selectEvidence") {
              dispatch({ type: "addScriptPage" });
            }
            if (selectDODState.currentStep === "addScript") {
              updateEvidence(
                selectDODState.selectedEvidence.map((evidence) => ({
                  id: evidence.id,
                  definition_of_done: true,
                  script: selectDODState.script
                }))
              );
            }
          }}
        >
          {selectDODState.currentStep === "selectEvidence" ? (
            "Next"
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>{isLoading ? "Adding ..." : "Add"}</>
          )}
        </button>
      </div>
    </>
  );
}
