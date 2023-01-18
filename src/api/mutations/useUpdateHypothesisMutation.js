import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHypothesis } from "../services/hypothesis";
import { createIncidentQueryKey } from "../query-hooks";
export const useUpdateHypothesisMutation = (options = {}) => {
  const { incidentId } = options;
  const queryClient = useQueryClient();
  const incidentQueryKey = createIncidentQueryKey(incidentId);

  return useMutation(({ id, params }) => updateHypothesis(id, params), {
    onSuccess: () => {
      queryClient.refetchQueries(incidentQueryKey);
    }
  });
};
