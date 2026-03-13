import { useRef, useMemo, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getViewDataById,
  getViewDisplayPluginVariables,
  getViewMetadataById,
  getSectionResultByViewRef,
  type DashboardResponse
} from "../../../api/services/views";
import {
  useAggregatedViewVariables,
  type SectionDataEntry
} from "./useAggregatedViewVariables";
import { toastError } from "../../../components/Toast/toast";
import { usePrefixedSearchParams } from "../../../hooks/usePrefixedSearchParams";
import { VIEW_VAR_PREFIX } from "../constants";
import { aggregateVariables } from "../utils/aggregateVariables";
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
 * **Fetching strategy** — when `sectionResults` are already present on
 * `/api/dashboard` or `/api/view/metadata/:id`, those prefetched section
 * payloads are used directly and per-section POST calls are skipped. Otherwise,
 * section data is fetched exactly once inside `useAggregatedViewVariables`
 * (which also aggregates section variables) and surfaced here as `sectionData`.
 * `ViewSection` components receive that data as props rather than issuing their
 * own queries.
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

  const [viewVarParams] = usePrefixedSearchParams(VIEW_VAR_PREFIX, false);
  const viewVarParamsString = useMemo(
    () => viewVarParams.toString(),
    [viewVarParams]
  );
  const standardModeVariables = useMemo(
    () => Object.fromEntries(viewVarParams.entries()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewVarParamsString]
  );
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

  const variables = isDisplayPluginMode
    ? displayPluginVariables
    : standardModeVariables;

  const hasStandardModeVariables = useMemo(
    () => Object.keys(standardModeVariables).length > 0,
    [standardModeVariables]
  );

  const viewQueryKey = isDisplayPluginMode
    ? ["viewDataById", viewId, configId, variables]
    : ["view-metadata", viewId];

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

      if (isDisplayPluginMode) {
        return getViewDataById(viewId, variables, headers);
      }

      return getViewMetadataById(viewId, headers);
    },
    enabled: isDisplayPluginMode ? !!variables : !!viewId,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true
  });

  useEffect(() => {
    if (isDisplayPluginMode || !viewResult?.name) {
      return;
    }

    const metadataResult = viewResult as DashboardResponse;
    if (!metadataResult.id) {
      return;
    }

    queryClient.setQueryData(
      [
        "view-section-result",
        metadataResult.namespace ?? "",
        metadataResult.name,
        ""
      ],
      metadataResult
    );

    metadataResult.sections?.forEach((section) => {
      if (!section.viewRef?.name) {
        return;
      }

      const sectionResult = getSectionResultByViewRef(
        metadataResult.sectionResults,
        section.viewRef
      );

      if (!sectionResult) {
        return;
      }

      queryClient.setQueryData(
        [
          "view-section-result",
          section.viewRef.namespace ?? "",
          section.viewRef.name,
          ""
        ],
        sectionResult
      );
    });
  }, [isDisplayPluginMode, queryClient, viewResult]);

  const allSectionRefs = useMemo<ViewRef[]>(() => {
    if (!viewResult?.sections) {
      return [];
    }

    return viewResult.sections
      .filter((section) => !!section.viewRef)
      .map((section) => ({
        namespace: section.viewRef?.namespace ?? "",
        name: section.viewRef?.name ?? ""
      }))
      .filter((ref) => !!ref.name);
  }, [viewResult?.sections]);

  const prefetchedSectionData = useMemo(() => {
    const sectionDataMap = new Map<string, SectionDataEntry>();

    if (isDisplayPluginMode || !viewResult?.sections) {
      return sectionDataMap;
    }

    const metadataResult = viewResult as DashboardResponse;

    metadataResult.sections?.forEach((section) => {
      if (!section.viewRef?.name) {
        return;
      }

      const sectionResult = getSectionResultByViewRef(
        metadataResult.sectionResults,
        section.viewRef
      );

      if (!sectionResult) {
        return;
      }

      const namespace = section.viewRef.namespace ?? "";
      sectionDataMap.set(`${namespace}:${section.viewRef.name}`, {
        data: sectionResult,
        isLoading: false
      });
    });

    return sectionDataMap;
  }, [isDisplayPluginMode, viewResult]);

  const prefetchedSectionAggregatedVariables = useMemo(
    () =>
      aggregateVariables(
        Array.from(prefetchedSectionData.values()).map(
          (entry) => entry.data?.variables
        )
      ),
    [prefetchedSectionData]
  );

  const shouldFetchSectionsForStandardModeVariables = useMemo(() => {
    if (isDisplayPluginMode || !hasStandardModeVariables) {
      return false;
    }

    const metadataVariables = aggregateVariables([
      viewResult?.variables,
      prefetchedSectionAggregatedVariables
    ]);

    if (metadataVariables.length === 0) {
      return true;
    }

    const defaultValues = new Map<string, string>();

    metadataVariables.forEach((variable) => {
      const value =
        variable.default ??
        (variable.optionItems && variable.optionItems.length > 0
          ? variable.optionItems[0].value
          : variable.options && variable.options.length > 0
            ? variable.options[0]
            : "");

      if (value) {
        defaultValues.set(variable.key, value);
      }
    });

    return Object.entries(standardModeVariables).some(([key, value]) => {
      const defaultValue = defaultValues.get(key);
      return !defaultValue || defaultValue !== value;
    });
  }, [
    hasStandardModeVariables,
    isDisplayPluginMode,
    prefetchedSectionAggregatedVariables,
    standardModeVariables,
    viewResult?.variables
  ]);

  const sectionsToQuery = useMemo<ViewRef[]>(() => {
    if (isDisplayPluginMode || shouldFetchSectionsForStandardModeVariables) {
      return allSectionRefs;
    }

    return allSectionRefs.filter(
      (section) =>
        !prefetchedSectionData.has(`${section.namespace ?? ""}:${section.name}`)
    );
  }, [
    allSectionRefs,
    isDisplayPluginMode,
    prefetchedSectionData,
    shouldFetchSectionsForStandardModeVariables
  ]);

  const {
    variables: queriedSectionAggregatedVariables,
    currentVariables: aggregatedCurrentVariables,
    sectionData: queriedSectionData
  } = useAggregatedViewVariables(
    sectionsToQuery,
    isDisplayPluginMode ? variables : undefined
  );

  const sectionData = useMemo(() => {
    const mergedSectionData = new Map<string, SectionDataEntry>(
      prefetchedSectionData
    );

    queriedSectionData.forEach((entry, key) => {
      mergedSectionData.set(key, entry);
    });

    return mergedSectionData;
  }, [prefetchedSectionData, queriedSectionData]);

  const metadataSectionVariables =
    !isDisplayPluginMode && !shouldFetchSectionsForStandardModeVariables
      ? prefetchedSectionAggregatedVariables
      : EMPTY_VARIABLES;

  const aggregatedVariables = useMemo(
    () =>
      aggregateVariables([
        viewResult?.variables,
        metadataSectionVariables,
        queriedSectionAggregatedVariables
      ]),
    [
      metadataSectionVariables,
      queriedSectionAggregatedVariables,
      viewResult?.variables
    ]
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

    const refsToInvalidate = allSectionRefs;

    if (isDisplayPluginMode) {
      await queryClient.invalidateQueries({
        queryKey: ["viewDisplayPluginVariables", viewId, configId]
      });
    }

    await Promise.all(
      refsToInvalidate.flatMap((section) => [
        queryClient.invalidateQueries({
          queryKey: ["view-section-result", section.namespace, section.name]
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
