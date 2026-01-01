import { useQuery } from "@tanstack/react-query";
import { getStartValue } from "../../utils/common";
import { getCanaryGraph, getHealthCheckDetails } from "../services/topology";
import { HealthCheck } from "../types/health";

export function useCanaryGraphQuery(
  timeRange: string,
  check?: Partial<Pick<HealthCheck, "id">>
) {
  return useQuery(["canaryGraph", check?.id, timeRange], async () => {
    const payload = {
      check: check?.id!,
      count: 300,
      start: getStartValue(timeRange)
    };
    const res = await getCanaryGraph(payload);
    return res.data ?? null;
  });
}

export function useGetCheckDetails(checkId?: string) {
  return useQuery({
    queryKey: ["check", "details", checkId],
    queryFn: async () => {
      const res = await getHealthCheckDetails(checkId!);
      return res;
    },
    enabled: !!checkId
  });
}
