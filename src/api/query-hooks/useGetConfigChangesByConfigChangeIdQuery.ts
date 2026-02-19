import { useQuery } from "@tanstack/react-query";
import { getConfigChangeById } from "../services/configs";

export function useGetConfigChangesById(
  id: string,
  configId?: string,
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery(
    ["configs", "changes", configId, id],
    () => getConfigChangeById(id, configId),
    {
      enabled: !!id && enabled
    }
  );
}
