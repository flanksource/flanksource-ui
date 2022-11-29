import { useMutation } from "@tanstack/react-query";
import { Evidence, updateEvidence } from "../../services/evidence";

/**
 *
 * useUpdateEvidenceMutation
 *
 * Update evidence mutation hook used to update evidence in the database
 *
 */
export default function useUpdateEvidenceMutation(param?: {
  onSuccess?: (evidence: Evidence[]) => void;
}) {
  return useMutation(
    // force id to be defined
    async (evidence: (Partial<Evidence> & { id: string })[]) => {
      return Promise.all(
        evidence.map(async ({ id, ...evidencePatch }) => {
          const res = await updateEvidence(id, {
            ...evidencePatch
          });
          return res.data?.[0];
        })
      );
    },
    {
      onSuccess: (evidence) => {
        const definedEvidence = evidence.filter(
          (evidence) => evidence
        ) as Evidence[];
        if (param?.onSuccess) {
          param.onSuccess(definedEvidence);
        }
      }
    }
  );
}
