import { getTopologyByID } from "../services/topology";
import { useQuery } from "@tanstack/react-query";

export function useComponentDetail(id: string) {
  return useQuery({
    queryKey: ["component", id],
    queryFn: () => getTopologyByID(id),
    select: (data) => data?.data
  });
}
