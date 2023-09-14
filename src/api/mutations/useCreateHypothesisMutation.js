import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { createHypothesisOld } from "../services/hypothesis";
import { createIncidentQueryKey } from "../query-hooks";
import { recentlyAddedHypothesisIdAtom } from "../../store/hypothesis.state";

export const useCreateHypothesisMutation = (options = {}) => {
  const { incidentId = "incorrect_incident_id" } = options;
  const queryClient = useQueryClient();
  const setRecentlyAddedHypothesisId = useSetAtom(
    recentlyAddedHypothesisIdAtom
  );
  return useMutation(
    ({ user, id, incidentId, params }) =>
      createHypothesisOld(user, id, incidentId, params),
    {
      onSettled: ({ data }) => {
        setRecentlyAddedHypothesisId(data?.[0].id);
        queryClient.invalidateQueries(createIncidentQueryKey(incidentId));
      }
    }
  );
};
