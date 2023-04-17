import { useMutation } from "@tanstack/react-query";
import {
  createEvidence,
  Evidence,
  updateEvidence
} from "../../services/evidence";
import { useIncidentState } from "../../../store/incident.state";

/**
 *
 * useUpdateEvidenceMutation
 *
 * Update evidence mutation hook used to update evidence in the database
 *
 */
export function useUpdateEvidenceMutation(
  param: {
    onSuccess?: (evidence: Evidence[]) => void;
  },
  incidentId: string
) {
  const { refetchIncident } = useIncidentState(incidentId);
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
        param.onSuccess?.(definedEvidence);
        refetchIncident();
      }
    }
  );
}

export function useCreateEvidenceMutation(
  param: {
    onSuccess?: (evidence?: Evidence) => void;
  },
  incidentId: string
) {
  const { refetchIncident } = useIncidentState(incidentId);
  return useMutation(
    async (
      evidence: Omit<Evidence, "created_by" | "created_at" | "hypothesis_id">
    ) => {
      const res = await createEvidence(evidence);
      return res.data?.[0];
    },
    {
      onSuccess: (evidence) => {
        param.onSuccess?.(evidence);
        refetchIncident();
      }
    }
  );
}
