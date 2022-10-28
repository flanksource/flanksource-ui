import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHypothesisOld } from "../../api/services/hypothesis";
import { createIncidentQueryKey } from "../../api/query-hooks";

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
