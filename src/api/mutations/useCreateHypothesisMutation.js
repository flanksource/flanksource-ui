import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHypothesisOld } from "../services/hypothesis";
import { createIncidentQueryKey } from "../query-hooks";

export const useCreateHypothesisMutation = (options = {}) => {
  const { incidentId = "incorrect_incident_id" } = options;
  const queryClient = useQueryClient();
  return useMutation(
    ({ user, id, incidentId, params }) =>
      createHypothesisOld(user, id, incidentId, params),
    {
      onSettled: () => {
        queryClient.invalidateQueries(createIncidentQueryKey(incidentId));
      }
    }
  );
};
