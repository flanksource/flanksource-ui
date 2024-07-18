import { useEffect, useState } from "react";
import { useUpdateEvidenceMutation } from "../../../../api/query-hooks/mutations/evidence";
import { Evidence } from "../../../../api/types/evidence";
import { Modal } from "../../../../ui/Modal";
import { ManualDoDInput } from "../AddDefinitionOfDone/AddManualDefinitionOfDone";

type Props = {
  evidence: Evidence;
  onCloseModal: () => void;
  isOpen: boolean;
  onSuccess: () => void;
  incidentId: string;
};

export default function EditEvidenceDefinitionOfDoneComment({
  evidence,
  onCloseModal,
  isOpen,
  incidentId,
  onSuccess
}: Props) {
  const [comment, setComment] = useState<string>();
  useEffect(() => {
    setComment(evidence.evidence?.comment || "");
  }, [evidence.evidence?.comment]);

  const { isLoading, mutate } = useUpdateEvidenceMutation(
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
          className="btn-primary px-4 py-2"
          type="button"
          key="update"
          onClick={async () => {
            mutate([
              {
                id: evidence.id,
                description: comment,
                evidence: {
                  ...evidence.evidence,
                  comment
                }
              }
            ]);
          }}
        >
          {isLoading ? "Updating ..." : "Update"}
        </button>
      ]}
    >
      <div className="flex w-full flex-col space-y-4 p-4">
        <ManualDoDInput
          value={comment}
          onChange={(comment) => setComment(comment)}
        />
      </div>
    </Modal>
  );
}
