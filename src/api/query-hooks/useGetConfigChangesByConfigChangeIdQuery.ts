import { useQuery } from "@tanstack/react-query";
import { getConfigChangeById } from "../services/configs";

export function useGetConfigChangesById(
  id: string,
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery(["configs", "changes", id], () => getConfigChangeById(id), {
    enabled: !!id && enabled
  });
}
