import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { getViewDataByNamespace } from "../../../api/services/views";
import { aggregateVariables } from "../utils/aggregateVariables";
import { usePrefixedSearchParams } from "../../../hooks/usePrefixedSearchParams";
import { VIEW_VAR_PREFIX } from "../constants";
import type { ViewRef, ViewResult } from "../../audit-report/types";

export interface SectionDataEntry {
  data?: ViewResult;
  isLoading: boolean;
  error?: unknown;
}

export function useAggregatedViewVariables(
  sections: ViewRef[],
  baseVariables?: Record<string, string>
) {
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

  const effectiveVariables = useMemo(
    () => ({ ...(baseVariables ?? {}), ...currentVariables }),
    [baseVariables, currentVariables]
  );

  const effectiveVariablesKey = useMemo(
    () =>
      Object.entries(effectiveVariables)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&"),
    [effectiveVariables]
  );

  // Fetch all sections in parallel
  const queries = useQueries({
    queries: sections.map((section) => ({
      queryKey: [
        "view-section-result",
        section.namespace,
        section.name,
        effectiveVariablesKey
      ],
      queryFn: () =>
        getViewDataByNamespace(
          section.namespace || "default",
          section.name,
          effectiveVariables
        ),
      enabled: !!section.name,
      staleTime: 5 * 60 * 1000,
      keepPreviousData: true
    }))
  });

  const isLoading = queries.some((q) => q.isLoading);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dataKey = queries.map((q) => q.dataUpdatedAt).join(",");
  const aggregatedVariables = useMemo(() => {
    const variableArrays = queries.map(
      (q) => (q.data as ViewResult | undefined)?.variables
    );
    return aggregateVariables(variableArrays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey]);

  const sectionData = useMemo(() => {
    const sectionDataMap = new Map<string, SectionDataEntry>();

    sections.forEach((section, index) => {
      const query = queries[index];

      if (!query) {
        return;
      }

      sectionDataMap.set(`${section.namespace ?? ""}:${section.name}`, {
        data: query.data as ViewResult | undefined,
        isLoading: query.isLoading,
        error: query.error ?? undefined
      });
    });

    return sectionDataMap;
  }, [queries, sections]);

  return {
    variables: aggregatedVariables,
    isLoading,
    currentVariables,
    sectionData
  };
}
