import { useMutation } from "@tanstack/react-query";
import { Topology } from "../../../context/TopologyPageContext";
import { updateComponent } from "../../services/topology";

export default function useUpdateComponentMutation(onSuccess?: () => void) {
  return useMutation(
    async ({ id, ...topology }: Partial<Topology> & { id: string }) => {
      return updateComponent(id, topology);
    },
    {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
      }
    }
  );
}
