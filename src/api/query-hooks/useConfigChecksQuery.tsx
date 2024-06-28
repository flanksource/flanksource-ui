import { useQuery } from "@tanstack/react-query";
import { getConfigChecks } from "../services/configs";

export default function useConfigChecksQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["config", "checks", id],
    queryFn: () => getConfigChecks(id!),
    enabled: id !== undefined,
    keepPreviousData: true
  });
}
