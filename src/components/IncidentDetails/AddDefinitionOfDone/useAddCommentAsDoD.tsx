import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCreateEvidenceMutation } from "../../../api/query-hooks/mutations/evidence";
import { Evidence, EvidenceType } from "../../../api/services/evidence";
import { useUser } from "../../../context";

export default function useAddCommentAsDoD(
  hypothesisId: string,
  incidentId: string,
  onSuccess: (evidence: Evidence[]) => void
) {
  const { user } = useUser();

  const { isLoading, mutate } = useCreateEvidenceMutation(
    {
      onSuccess: (evidence) => {
        onSuccess([evidence!]);
      }
    },
    incidentId
  );

  const addCommentAsDoD = useCallback(
    async (comment: string) => {
      const evidence: Omit<
        Evidence,
        "created_by" | "created_at" | "hypothesis_id"
      > = {
        id: uuidv4(),
        user: user!,
        hypothesisId: hypothesisId,
        evidence: {
          comment: comment
        },
        type: EvidenceType.Comment,
        description: comment ?? "",
        definition_of_done: true
      };

      mutate(evidence);
    },
    [hypothesisId, mutate, user]
  );

  return {
    isLoading,
    mutate: addCommentAsDoD
  };
}
