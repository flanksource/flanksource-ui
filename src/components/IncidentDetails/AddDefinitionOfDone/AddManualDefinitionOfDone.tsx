import { useState } from "react";
import { Evidence } from "../../../api/types/evidence";
import { TextInput } from "../../TextInput";
import useAddCommentAsDoD from "./useAddCommentAsDoD";

type ManualDoDInputProps = {
  value?: string;
  onChange: (value: string) => void;
};

export function ManualDoDInput({ value, onChange }: ManualDoDInputProps) {
  return (
    <TextInput
      id="manual-dod-input"
      onChange={(val) => onChange(val.target.value)}
      onEnter={() => {}}
      value={value}
      placeholder="Add comment"
    />
  );
}

type Props = {
  hypothesisId: string;
  incidentId: string;
  onSuccess: (evidence: Evidence[]) => void;
};

export default function AddManualDefinitionOfDone({
  hypothesisId,
  incidentId,
  onSuccess
}: Props) {
  const [value, onChange] = useState<string>();

  const { mutate, isLoading } = useAddCommentAsDoD(
    hypothesisId,
    incidentId,
    onSuccess
  );

  return (
    <div className="w-full flex flex-col space-y-4 py-4 px-6 overflow-x-hidden">
      {/* title */}
      <div className="w-full flex flex-row space-y-2">
        <div className="flex flex-col flex-1 space-y-2">
          <h3 className="font-semibold text-gray-900">
            Manual Definition of Done
          </h3>
        </div>
      </div>
      <div className="w-full flex flex-col space-y-4">
        <ManualDoDInput value={value} onChange={onChange} />
      </div>
      <div className={`flex justify-end w-full`}>
        <button
          disabled={isLoading || !value}
          className="px-4 py-2 btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
          type="button"
          onClick={async () => {
            if (value) {
              mutate(value);
            }
          }}
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
