import { useRef, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getViewDataById,
  getViewDisplayPluginVariables
} from "../../../api/services/views";
import {
  useAggregatedViewVariables,
  type SectionDataEntry
} from "./useAggregatedViewVariables";
import { toastError } from "../../../components/Toast/toast";
import type {
  ViewRef,
  ViewResult,
  ViewVariable
} from "../../audit-report/types";

const EMPTY_VARIABLES: ViewVariable[] = [];

export interface UseViewDataOptions {
  viewId: string;
  configId?: string;
}

export interface UseViewDataResult {
  viewResult: ViewResult | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  aggregatedVariables: ViewVariable[];
  currentVariables: Record<string, string>;
  sectionData: Map<string, SectionDataEntry>;
  handleForceRefresh: () => Promise<void>;
}

/**
 * Fetches and manages all data needed to render a view.
 *
 * Supports two modes:
 *
 * **Standard mode** (`viewId` only): Fetches the top-level view by ID, then
 * fetches all of its sections (viewRef-based) in parallel via
 * `useAggregatedViewVariables`. URL search params prefixed with the view
 * variable prefix are read and forwarded to every request as query-time
 * variable overrides.
 *
 * **Display-plugin mode** (`viewId` + `configId`): Used when a view is
 * embedded inside a config detail tab. A preliminary request resolves the
 * config-specific variables (e.g. `{{ .config.id }}`), which are then
 * forwarded to the view fetch and to section fetches. URL search params are
 * ignored in this mode — the config variables are the source of truth.
 * `aggregatedVariables` is intentionally emptied in this mode because the
 * global variable filter UI should not be shown inside an embedded tab.
 *
 * **Fetching strategy** — to avoid duplicate network requests, section data is
 * fetched exactly once inside `useAggregatedViewVariables` (which needs the
 * responses for variable aggregation anyway) and the results are surfaced here
 * as `sectionData`. `ViewSection` components receive that data as props rather
 * than issuing their own queries.
 *
 * **Force-refresh** — `handleForceRefresh` re-fetches the top-level view with
 * a `cache-control: max-age=1` header to bypass server-side caching, then
 * invalidates the React Query cache for all related section queries so they
 * are re-fetched on the next render.
 */
export function useViewData({
  viewId,
  configId
}: UseViewDataOptions): UseViewDataResult {
  const queryClient = useQueryClient();
  const forceRefreshRef = useRef(false);

  const isDisplayPluginMode = !!configId;

  const {
    data: displayPluginVariables,
    isLoading: isLoadingDisplayPluginVariables,
    isFetching: isFetchingDisplayPluginVariables,
    error: displayPluginVariablesError
  } = useQuery({
    queryKey: ["viewDisplayPluginVariables", viewId, configId],
    queryFn: () => getViewDisplayPluginVariables(viewId, configId!),
    enabled: isDisplayPluginMode
  });

  const variables = isDisplayPluginMode ? displayPluginVariables : undefined;

  const viewQueryKey = isDisplayPluginMode
    ? ["viewDataById", viewId, configId, variables]
    : ["view-result", viewId];

  const {
    data: viewResult,
    isLoading: isLoadingViewResult,
    isFetching: isFetchingViewResult,
    error: viewResultError,
    refetch
  } = useQuery({
    queryKey: viewQueryKey,
    queryFn: () => {
      const headers = forceRefreshRef.current
        ? { "cache-control": "max-age=1" }
        : undefined;
      return getViewDataById(viewId, variables, headers);
    },
    enabled: isDisplayPluginMode ? !!variables : !!viewId,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true
  });

  const allSectionRefs = useMemo<ViewRef[]>(() => {
    if (!viewResult?.name) {
      return [];
    }
    const refs: ViewRef[] = [
      { namespace: viewResult.namespace ?? "", name: viewResult.name }
    ];
    if (viewResult?.sections) {
      viewResult.sections.forEach((section) => {
        // Only include sections that reference other views (not native UI sections)
        if (section.viewRef) {
          refs.push({
            namespace: section.viewRef.namespace ?? "",
            name: section.viewRef.name
          });
        }
      });
    }
    return refs;
  }, [viewResult?.namespace, viewResult?.name, viewResult?.sections]);

  const {
    variables: aggregatedVariables,
    currentVariables: aggregatedCurrentVariables,
    sectionData
  } = useAggregatedViewVariables(
    allSectionRefs,
    isDisplayPluginMode ? variables : undefined
  );

  const currentVariables = isDisplayPluginMode
    ? (variables ?? {})
    : aggregatedCurrentVariables;

  const handleForceRefresh = useCallback(async () => {
    forceRefreshRef.current = true;
    const result = await refetch();
    forceRefreshRef.current = false;

    if (result.isError) {
      const err = result.error as any;
      toastError(
        err?.message ||
          err?.error ||
          err?.detail ||
          err?.msg ||
          "Failed to refresh view"
      );
      return;
    }

    const sectionsToRefresh =
      allSectionRefs.length > 0 && allSectionRefs[0].name
        ? allSectionRefs
        : result.data?.name
          ? [{ namespace: result.data.namespace ?? "", name: result.data.name }]
          : [];
    const currentNamespace = result.data?.namespace ?? viewResult?.namespace;
    const currentName = result.data?.name ?? viewResult?.name;
    const refsToInvalidate = sectionsToRefresh.filter(
      (section) =>
        !(
          currentName &&
          section.name === currentName &&
          section.namespace === (currentNamespace ?? "")
        )
    );

    if (isDisplayPluginMode) {
      await queryClient.invalidateQueries({
        queryKey: ["viewDisplayPluginVariables", viewId, configId]
      });
    }

    await Promise.all(
      refsToInvalidate.flatMap((section) => [
        queryClient.invalidateQueries({
          queryKey: ["view-result", section.namespace, section.name]
        }),
        queryClient.invalidateQueries({
          queryKey: ["view-table", section.namespace, section.name]
        }),
        queryClient.invalidateQueries({
          queryKey: ["view-variables", section.namespace, section.name]
        })
      ])
    );
  }, [
    viewResult?.namespace,
    viewResult?.name,
    allSectionRefs,
    configId,
    isDisplayPluginMode,
    queryClient,
    refetch,
    viewId
  ]);

  return {
    viewResult,
    isLoading: isLoadingViewResult || isLoadingDisplayPluginVariables,
    isFetching: isFetchingViewResult || isFetchingDisplayPluginVariables,
    error: displayPluginVariablesError || viewResultError,
    aggregatedVariables: isDisplayPluginMode
      ? EMPTY_VARIABLES
      : aggregatedVariables,
    currentVariables,
    sectionData,
    handleForceRefresh
  };
}
