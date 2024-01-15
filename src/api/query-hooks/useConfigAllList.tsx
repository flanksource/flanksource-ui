import { useQuery } from "@tanstack/react-query";
import { getConfigListFilteredByType } from "../services/configs";

export default function useConfigAllList(type: string[]) {
  return useQuery({
    queryKey: ["configs", "list", "all", "simplified", type],
    queryFn: () => getConfigListFilteredByType(type),
    select: (data) => data?.data
  });
}
