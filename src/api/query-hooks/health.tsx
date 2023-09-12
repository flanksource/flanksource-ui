import { useQuery } from "@tanstack/react-query";
import { HealthCheck } from "../../types/healthChecks";
import { getStartValue } from "../../utils/common";
import { getCanaryGraph } from "../services/topology";

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
    return res.data ?? undefined;
  });
}
