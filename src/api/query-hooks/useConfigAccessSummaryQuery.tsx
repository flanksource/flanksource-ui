import { useQuery } from "@tanstack/react-query";
import { getConfigAccessSummary } from "../services/configs";

export default function useConfigAccessSummaryQuery(
  configId: string | undefined
) {
  return useQuery({
    queryKey: ["config", "access-summary", configId],
    queryFn: () => getConfigAccessSummary(configId!),
    enabled: !!configId,
    keepPreviousData: true
  });
}
