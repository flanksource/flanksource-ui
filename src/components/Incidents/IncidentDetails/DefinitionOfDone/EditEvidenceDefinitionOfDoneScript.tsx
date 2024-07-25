import { useEffect, useState } from "react";
import { useUpdateEvidenceMutation } from "../../../../api/query-hooks/mutations/evidence";
import { Evidence } from "../../../../api/types/evidence";
import { Modal } from "../../../../ui/Modal";
import { ScriptStep } from "../AddDefinitionOfDone/steps/ScriptStep";

type Props = {
  evidence: Evidence;
  onCloseModal: () => void;
  isOpen: boolean;
  onSuccess: () => void;
  incidentId: string;
};

export default function EditEvidenceDefinitionOfDoneScript({
  evidence,
  onCloseModal,
  isOpen,
  onSuccess,
  incidentId
}: Props) {
  const [dodScript, setDodScript] = useState<string>();

  useEffect(() => {
    setDodScript(evidence.script);
  }, [evidence.script]);

  const { isLoading, mutateAsync } = useUpdateEvidenceMutation(
    {
      onSuccess
    },
    incidentId
  );

  return (
    <Modal
      title={"Update Definition of Done"}
      onClose={onCloseModal}
      open={isOpen}
      bodyClass=""
      size="full"
      actions={[
        <button
          key="update"
          className="btn-primary px-4 py-2"
          type="button"
          onClick={async () => {
            await mutateAsync([
              {
                id: evidence.id,
                definition_of_done: true,
                script: dodScript
              }
            ]);
          }}
        >
          {isLoading ? "Updating ..." : "Update"}
        </button>
      ]}
    >
      <div className="flex w-full flex-col space-y-4 p-4">
        <ScriptStep
          value={dodScript}
          evidenceType={evidence.type}
          onChange={(script) => setDodScript(script)}
        />
      </div>
    </Modal>
  );
}
