import { useRef, useMemo, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getViewDataById,
  getViewDisplayPluginVariables,
  getViewMetadataById,
  getSectionResultByViewRef
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
  isPreviousData: boolean;
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
 * **Fetching strategy** — `/api/view/metadata/:id` describes the view: its
 * sections, variable definitions and their defaults, none of which depend on
 * the selected variable values. It is fetched independently of the data
 * endpoint and carries prefetched `sectionResults`, so a view whose variables
 * are all at their defaults costs a single request. The data endpoint
 * (`/api/view/:id`) is only used once a variable is set to something other
 * than its default, and section data is then fetched inside
 * `useAggregatedViewVariables` (which also aggregates section variables) and
 * surfaced here as `sectionData`. `ViewSection` components receive that data
 * as props rather than issuing their own queries.
 *
 * Variables are aggregated metadata-first so the set of keys can only grow
 * while requests are in flight. A variable that vanished mid-fetch would be
 * dropped from the URL by the filter form and reset to its default.
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

  const refreshHeaders = () =>
    forceRefreshRef.current ? { "cache-control": "max-age=1" } : undefined;

  const {
    data: metadataResult,
    isLoading: isLoadingMetadata,
    isFetching: isFetchingMetadata,
    error: metadataError,
    refetch: refetchMetadata
  } = useQuery({
    queryKey: ["view-metadata", viewId],
    queryFn: () => getViewMetadataById(viewId, refreshHeaders()),
    enabled: !isDisplayPluginMode && !!viewId,
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    if (isDisplayPluginMode || !metadataResult?.name || !metadataResult.id) {
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
  }, [isDisplayPluginMode, queryClient, metadataResult]);

  const prefetchedSectionData = useMemo(() => {
    const sectionDataMap = new Map<string, SectionDataEntry>();

    if (isDisplayPluginMode || !metadataResult?.sections) {
      return sectionDataMap;
    }

    metadataResult.sections.forEach((section) => {
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
  }, [isDisplayPluginMode, metadataResult]);

  const prefetchedSectionAggregatedVariables = useMemo(
    () =>
      aggregateVariables(
        Array.from(prefetchedSectionData.values()).map(
          (entry) => entry.data?.variables
        )
      ),
    [prefetchedSectionData]
  );

  // The filter form seeds the URL with every variable's default, so the mere
  // presence of URL variables says nothing about whether the user changed
  // anything. Only a value that differs from its default needs the data
  // endpoint; anything else is already covered by the metadata response.
  const hasNonDefaultVariables = useMemo(() => {
    if (isDisplayPluginMode || !hasStandardModeVariables || !metadataResult) {
      return false;
    }

    const metadataVariables = aggregateVariables([
      metadataResult.variables,
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
    metadataResult,
    prefetchedSectionAggregatedVariables,
    standardModeVariables
  ]);

  const isDataQueryEnabled = isDisplayPluginMode
    ? !!variables
    : hasNonDefaultVariables;

  const {
    data: dataResult,
    isLoading: isLoadingDataResult,
    isFetching: isFetchingDataResult,
    isPreviousData,
    error: dataResultError,
    refetch: refetchData
  } = useQuery({
    queryKey: isDisplayPluginMode
      ? ["viewDataById", viewId, configId, variables]
      : ["viewDataById", viewId, viewVarParamsString],
    queryFn: () =>
      getViewDataById(
        viewId,
        isDisplayPluginMode ? variables : standardModeVariables,
        refreshHeaders()
      ),
    enabled: isDataQueryEnabled,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true
  });

  // `keepPreviousData` keeps serving the previous key's response after the
  // query is disabled, so a reset back to the defaults would otherwise keep
  // rendering the last non-default result forever.
  const viewResult = isDisplayPluginMode
    ? dataResult
    : isDataQueryEnabled
      ? (dataResult ?? metadataResult)
      : metadataResult;

  const allSectionRefs = useMemo<ViewRef[]>(() => {
    const sections = isDisplayPluginMode
      ? dataResult?.sections
      : metadataResult?.sections;

    if (!sections) {
      return [];
    }

    return sections
      .filter((section) => !!section.viewRef)
      .map((section) => ({
        namespace: section.viewRef?.namespace ?? "",
        name: section.viewRef?.name ?? ""
      }))
      .filter((ref) => !!ref.name);
  }, [isDisplayPluginMode, dataResult?.sections, metadataResult?.sections]);

  const sectionsToQuery = useMemo<ViewRef[]>(() => {
    if (isDisplayPluginMode || hasNonDefaultVariables) {
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
    hasNonDefaultVariables
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

  // Metadata first: its keys, labels and defaults are stable across fetches,
  // so the aggregate can only gain keys as data responses arrive. Later
  // sources still contribute their options, which `aggregateVariables` unions.
  const aggregatedVariables = useMemo(
    () =>
      aggregateVariables([
        metadataResult?.variables,
        prefetchedSectionAggregatedVariables,
        dataResult?.variables,
        queriedSectionAggregatedVariables
      ]),
    [
      dataResult?.variables,
      metadataResult?.variables,
      prefetchedSectionAggregatedVariables,
      queriedSectionAggregatedVariables
    ]
  );

  const currentVariables = isDisplayPluginMode
    ? (variables ?? {})
    : aggregatedCurrentVariables;

  const handleForceRefresh = useCallback(async () => {
    forceRefreshRef.current = true;
    const results = await Promise.all([
      isDisplayPluginMode ? undefined : refetchMetadata(),
      isDataQueryEnabled ? refetchData() : undefined
    ]);
    forceRefreshRef.current = false;

    const result = results.find((it) => it?.isError);

    if (result?.isError) {
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
    isDataQueryEnabled,
    isDisplayPluginMode,
    queryClient,
    refetchData,
    refetchMetadata,
    viewId
  ]);

  return {
    viewResult,
    isLoading: isDisplayPluginMode
      ? isLoadingDataResult || isLoadingDisplayPluginVariables
      : isLoadingMetadata,
    isFetching:
      isFetchingMetadata ||
      (isDataQueryEnabled && isFetchingDataResult) ||
      isFetchingDisplayPluginVariables,
    isPreviousData,
    error: displayPluginVariablesError || dataResultError || metadataError,
    aggregatedVariables: isDisplayPluginMode
      ? EMPTY_VARIABLES
      : aggregatedVariables,
    currentVariables,
    sectionData,
    handleForceRefresh
  };
}
