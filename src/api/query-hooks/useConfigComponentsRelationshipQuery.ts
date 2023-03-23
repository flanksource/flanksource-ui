import { useQuery } from "@tanstack/react-query";
import { getConfigComponentRelationships } from "../services/configs";

export function useConfigComponentsRelationshipQuery<T>(configId: string) {
  return useQuery(
    ["configs", "component", "relationships", configId],
    () => getConfigComponentRelationships<T>(configId),
    {
      enabled: !!configId
    }
  );
}
