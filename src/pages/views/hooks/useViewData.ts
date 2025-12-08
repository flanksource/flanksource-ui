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

  const { data: displayPluginVariables } = useQuery({
    queryKey: ["viewDisplayPluginVariables", viewId, configId],
    queryFn: () => getViewDisplayPluginVariables(viewId, configId!),
    enabled: isDisplayPluginMode
  });

  const variables = isDisplayPluginMode ? displayPluginVariables : undefined;

  const {
    data: viewResult,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: isDisplayPluginMode
      ? ["viewDataById", viewId, configId, variables]
      : ["view-result", viewId],
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
    if (!viewResult?.namespace || !viewResult?.name) {
      return [];
    }
    const refs: ViewRef[] = [
      { namespace: viewResult.namespace, name: viewResult.name }
    ];
    if (viewResult?.sections) {
      viewResult.sections.forEach((section) => {
        refs.push({
          namespace: section.viewRef.namespace,
          name: section.viewRef.name
        });
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
      allSectionRefs.length > 0 &&
      allSectionRefs[0].namespace &&
      allSectionRefs[0].name
        ? allSectionRefs
        : result.data?.namespace && result.data.name
          ? [{ namespace: result.data.namespace, name: result.data.name }]
          : [];

    await queryClient.invalidateQueries({
      queryKey: isDisplayPluginMode
        ? ["viewDataById", viewId, configId, variables]
        : ["view-result", viewId]
    });

    await Promise.all(
      sectionsToRefresh.flatMap((section) => [
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
    allSectionRefs,
    configId,
    isDisplayPluginMode,
    queryClient,
    refetch,
    variables,
    viewId
  ]);

  return {
    viewResult,
    isLoading,
    isFetching,
    error,
    aggregatedVariables: isDisplayPluginMode ? [] : aggregatedVariables,
    currentVariables,
    handleForceRefresh
  };
}
