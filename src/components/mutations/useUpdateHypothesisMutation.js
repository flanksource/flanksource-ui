import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHypothesis } from "../../api/services/hypothesis";
import { createIncidentQueryKey } from "../../api/query-hooks";

const updateHypothesisInIncident = (incident, id, values) =>
  incident.map((i) => ({
    ...i,
    hypothesis: i.hypothesis.map((h) => {
      if (h.id === id) {
        return {
          ...h,
          ...values
        };
      }
      return h;
    })
  }));

export const useUpdateHypothesisMutation = (options = {}) => {
  const { incidentId = "incorrect_incident_id" } = options;
  const queryClient = useQueryClient();
  const incidentQueryKey = createIncidentQueryKey(incidentId);

  return useMutation(({ id, params }) => updateHypothesis(id, params), {
    onMutate: async (data) => {
      const previousIncident = queryClient.getQueryData(incidentQueryKey);

      if (!previousIncident || !previousIncident[0]) {
        return { previousIncident };
      }

      const newIncident = updateHypothesisInIncident(
        previousIncident,
        data.id,
        data.params
      );

      queryClient.setQueryData(incidentQueryKey, newIncident);

      return { previousIncident, newIncident };
    },
    onSuccess: (resp, variables) => {
      const previousIncident = queryClient.getQueryData(incidentQueryKey);

      if (previousIncident && previousIncident[0]) {
        queryClient.setQueryData(
          incidentQueryKey,
          updateHypothesisInIncident(
            previousIncident,
            variables.id,
            variables.params
          )
        );
      }
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(incidentQueryKey, context.previousIncident);
      queryClient.invalidateQueries(createIncidentQueryKey(incidentId));
    }
  });
};
