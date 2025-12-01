import { useQueries } from "@tanstack/react-query";
import { getViewDataByNamespace } from "../../../api/services/views";
import { aggregateVariables } from "../utils/aggregateVariables";
import { usePrefixedSearchParams } from "../../../hooks/usePrefixedSearchParams";
import { VIEW_VAR_PREFIX } from "../constants";

interface ViewRef {
  namespace: string;
  name: string;
}

export function useAggregatedViewVariables(sections: ViewRef[]) {
  const [viewVarParams] = usePrefixedSearchParams(VIEW_VAR_PREFIX, false);
  const currentVariables = Object.fromEntries(viewVarParams.entries());

  // Fetch all sections in parallel
  const queries = useQueries({
    queries: sections.map((section) => ({
      queryKey: ["view-variables", section.namespace, section.name],
      queryFn: () => getViewDataByNamespace(section.namespace, section.name),
      enabled: !!section.namespace && !!section.name,
      staleTime: 5 * 60 * 1000,
      keepPreviousData: true
    }))
  });

  const isLoading = queries.some((q) => q.isLoading);
  const variableArrays = queries.map((q) => q.data?.variables);
  const aggregatedVariables = aggregateVariables(variableArrays);

  return {
    variables: aggregatedVariables,
    isLoading,
    currentVariables
  };
}
