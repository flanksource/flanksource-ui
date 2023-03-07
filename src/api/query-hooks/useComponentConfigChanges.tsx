import { useQuery } from "@tanstack/react-query";
import { getComponentConfigChanges } from "../services/configs";

export function useComponentConfigChanges<T>(topologyId: string) {
  return useQuery(
    ["component", "configs", "changes", topologyId],
    () => getComponentConfigChanges<T>(topologyId),
    {
      enabled: !!topologyId
    }
  );
}
