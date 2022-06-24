import { useMutation, useQueryClient } from "react-query";
import { createHypothesisOld } from "../../api/services/hypothesis";
import { createIncidentQueryKey } from "../query-hooks/useIncidentQuery";

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
