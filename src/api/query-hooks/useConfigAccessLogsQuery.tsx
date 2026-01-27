import { useQuery } from "@tanstack/react-query";
import { getConfigAccessLogs } from "../services/configs";

export default function useConfigAccessLogsQuery(configId: string | undefined) {
  return useQuery({
    queryKey: ["config", "access-logs", configId],
    queryFn: () => getConfigAccessLogs(configId!),
    enabled: !!configId,
    keepPreviousData: true
  });
}
