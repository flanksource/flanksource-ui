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
    // Use the string representation as the dep key — it's a primitive so
    // Object.is comparison keeps the memo stable when the content hasn't changed,
    // even though the URLSearchParams reference is new.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewVarParamsString]
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
          section.namespace || "",
          section.name,
          currentVariables
        ),
      enabled: !!section.namespace && !!section.name,
      staleTime: 5 * 60 * 1000,
      keepPreviousData: true
    }))
  });

  const isLoading = queries.some((q) => q.isLoading);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dataKey = queries.map((q) => q.dataUpdatedAt).join(",");
  const aggregatedVariables = useMemo(() => {
    const variableArrays = queries.map((q) => q.data?.variables);
    return aggregateVariables(variableArrays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey]);

  return {
    variables: aggregatedVariables,
    isLoading,
    currentVariables
  };
}
