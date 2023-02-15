import { useMutation } from "@tanstack/react-query";
import {
  Hypothesis,
  NewHypothesis,
  createHypothesis,
  HypothesisInfo,
  updateHypothesis
} from "../../services/hypothesis";

export function useCreateHypothesisMutation({
  onSuccess
}: {
  onSuccess?: (hypothesis?: Hypothesis) => void;
}) {
  return useMutation(
    async (hypothesis: NewHypothesis) => {
      const res = await createHypothesis(hypothesis);
      return res.data;
    },
    {
      onSuccess: (hypothesis) => {
        if (onSuccess) {
          onSuccess(hypothesis ?? undefined);
        }
      }
    }
  );
}

export function useUpdateHypothesisMutation({
  onSuccess
}: {
  onSuccess?: (hypothesis?: Hypothesis) => void;
}) {
  return useMutation(
    // force id to be defined
    async ({ id, ...hypothesis }: Partial<HypothesisInfo> & { id: string }) => {
      const res = await updateHypothesis(id, hypothesis);
      return res.data?.[0];
    },
    {
      onSuccess: (hypothesis) => {
        if (onSuccess) {
          onSuccess(hypothesis ?? undefined);
        }
      }
    }
  );
}
