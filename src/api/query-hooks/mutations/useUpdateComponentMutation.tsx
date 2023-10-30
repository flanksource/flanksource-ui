import { useMutation } from "@tanstack/react-query";
import { updateComponent } from "../../services/topology";
import { Topology } from "../../types/topology";

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
