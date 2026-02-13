import { useRef, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getViewDataById,
  getViewDisplayPluginVariables
} from "../../../api/services/views";
import { useAggregatedViewVariables } from "./useAggregatedViewVariables";
import { toastError } from "../../../components/Toast/toast";
import type {
  ViewRef,
  ViewResult,
  ViewVariable
} from "../../audit-report/types";

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
  handleForceRefresh: () => Promise<void>;
}

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
    currentVariables: aggregatedCurrentVariables
  } = useAggregatedViewVariables(allSectionRefs);

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
    aggregatedVariables: isDisplayPluginMode ? [] : aggregatedVariables,
    currentVariables,
    handleForceRefresh
  };
}
