import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { getViewDataByNamespace } from "../../../api/services/views";
import { aggregateVariables } from "../utils/aggregateVariables";
import { usePrefixedSearchParams } from "../../../hooks/usePrefixedSearchParams";
import { VIEW_VAR_PREFIX } from "../constants";
import type { ViewRef } from "../../audit-report/types";

export function useAggregatedViewVariables(sections: ViewRef[]) {
  const [viewVarParams] = usePrefixedSearchParams(VIEW_VAR_PREFIX, false);
  const viewVarParamsString = useMemo(
    () => viewVarParams.toString(),
    [viewVarParams]
  );
  const currentVariables = useMemo(
    () => Object.fromEntries(viewVarParams.entries()),
    [viewVarParams]
  );

  // Use a stable key for the current variables to avoid needless refetches
  const currentVariablesKey = viewVarParamsString;

  // Fetch all sections in parallel
  const queries = useQueries({
    queries: sections.map((section) => ({
      queryKey: [
        "view-variables",
        section.namespace,
        section.name,
        currentVariablesKey
      ],
      queryFn: () =>
        getViewDataByNamespace(
          section.namespace,
          section.name,
          currentVariables
        ),
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
