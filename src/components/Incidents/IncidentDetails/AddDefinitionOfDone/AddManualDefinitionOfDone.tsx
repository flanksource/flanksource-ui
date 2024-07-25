import { useState } from "react";
import { Evidence } from "../../../../api/types/evidence";
import { TextInput } from "../../../../ui/FormControls/TextInput";
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
    <div className="flex w-full flex-col space-y-4 overflow-x-hidden px-6 py-4">
      {/* title */}
      <div className="flex w-full flex-row space-y-2">
        <div className="flex flex-1 flex-col space-y-2">
          <h3 className="font-semibold text-gray-900">
            Manual Definition of Done
          </h3>
        </div>
      </div>
      <div className="flex w-full flex-col space-y-4">
        <ManualDoDInput value={value} onChange={onChange} />
      </div>
      <div className={`flex w-full justify-end`}>
        <button
          disabled={isLoading || !value}
          className="btn-primary px-4 py-2 disabled:cursor-not-allowed disabled:bg-gray-400"
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
