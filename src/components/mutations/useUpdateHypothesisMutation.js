import { useMutation } from "react-query";
import { updateHypothesis } from "../../api/services/hypothesis";

export const useUpdateHypothesisMutation = (options = {}) => useMutation(
  ({id, params}) => {
    return updateHypothesis(id, params);
  },
  options
);
