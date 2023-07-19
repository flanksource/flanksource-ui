import { useQuery } from "@tanstack/react-query";
import { getComponentConfigChanges } from "../services/configs";

export function useComponentConfigChanges(topologyId: string) {
  return useQuery(
    ["component", "configs", "changes", topologyId],
    () => getComponentConfigChanges(topologyId),
    {
      enabled: !!topologyId
    }
  );
}
