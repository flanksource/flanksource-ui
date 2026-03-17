import { useQuery } from "@tanstack/react-query";
import { getConfigAccessSummary } from "../services/configAccess";

export default function useConfigAccessSummaryQuery(
  configId: string | undefined
) {
  return useQuery({
    queryKey: ["config", "access-summary", configId],
    queryFn: () => getConfigAccessSummary({ configId: configId! }),
    enabled: !!configId,
    keepPreviousData: true
  });
}
