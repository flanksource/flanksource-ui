import { getHealthCheckByID } from "../services/check";
import { useQuery } from "@tanstack/react-query";

export function useCheckDetail(id: string) {
  return useQuery({
    queryKey: ["check", id],
    queryFn: () => getHealthCheckByID(id),
    select: (data) => data?.data
  });
}
