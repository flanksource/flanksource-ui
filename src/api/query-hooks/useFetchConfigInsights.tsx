import { useSearchParams } from "react-router-dom";
import { useConfigInsightsQuery } from "./useConfigAnalysisQuery";

export default function useFetchConfigInsights(
  setIsLoading: (isLoading: boolean) => void,
  configId?: string
) {
  const [params] = useSearchParams();

  const status = params.get("status") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const type = params.get("type") ?? undefined;
  const configType = params.get("configType") ?? undefined;
  const analyzer = params.get("analyzer") ?? undefined;
  const component = params.get("component") ?? undefined;
  const pageSize = +(params.get("pageSize") ?? 50);
  const pageIndex = +(params.get("pageIndex") ?? 0);

  return useConfigInsightsQuery(
    {
      status,
      severity: severity?.toLowerCase(),
      type,
      analyzer,
      component,
      configId,
      configType
    },
    {
      sortBy: params.get("sortBy") ?? undefined,
      sortOrder: params.get("sortOrder") as "asc" | "desc" | undefined
    },
    {
      pageIndex,
      pageSize
    },
    {
      keepPreviousData: true,
      onSuccess: () => setIsLoading(false)
    }
  );
}
