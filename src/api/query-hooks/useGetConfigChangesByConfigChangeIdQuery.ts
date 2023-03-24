import { useQuery } from "@tanstack/react-query";
import { getConfigChangeById } from "../services/configs";

export function useGetConfigChangesByConfigChangeIdQuery(
  id: string,
  configId: string,
  { enabled = true }
) {
  return useQuery(
    ["configs", "changes", configId, id],
    () => getConfigChangeById(id, configId),
    {
      enabled: !!id && !!configId && enabled
    }
  );
}
