import { useEffect, useState } from "react";
import { useUpdateEvidenceMutation } from "../../../api/query-hooks/mutations/evidence";
import { Evidence } from "../../../api/services/evidence";
import { Modal } from "../../Modal";
import { ScriptStep } from "../AddDefinitionOfDone/steps/ScriptStep";

type Props = {
  evidence: Evidence;
  onCloseModal: () => void;
  isOpen: boolean;
  onSuccess: () => void;
};

export default function EditEvidenceDefinitionOfDoneScript({
  evidence,
  onCloseModal,
  isOpen,
  onSuccess
}: Props) {
  const [dodScript, setDodScript] = useState<string>();

  useEffect(() => {
    setDodScript(evidence.script);
  }, [evidence.script]);

  const { isLoading, mutateAsync } = useUpdateEvidenceMutation({
    onSuccess
  });

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
          className="px-4 py-2 btn-primary"
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
      <div className="w-full flex flex-col space-y-4 p-4">
        <ScriptStep
          value={dodScript}
          evidenceType={evidence.type}
          onChange={(script) => setDodScript(script)}
        />
      </div>
    </Modal>
  );
}
