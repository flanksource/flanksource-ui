import { useQuery } from "@tanstack/react-query";
import { getConfigList } from "../services/configs";

export default function useConfigAllList(type?: string) {
  return useQuery({
    queryKey: ["configs", "list", "all", "simplified", type],
    queryFn: () => getConfigList(type),
    select: (data) => data?.data
  });
}
