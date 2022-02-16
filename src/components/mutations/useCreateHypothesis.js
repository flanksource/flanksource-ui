import { useMutation } from "react-query";
import { createHypothesis } from "../../api/services/hypothesis";

export const useCreateHypothesisMutation = (options = {}) =>
  useMutation(
    ({ user, id, incidentId, params }) =>
      createHypothesis(user, id, incidentId, params),
    options
  );
