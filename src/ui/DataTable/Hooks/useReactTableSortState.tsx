import { SortingState, Updater } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

type SortStateOptions = {
  /**
   * Optional prefix to namespace the sort search params.
   */
  paramPrefix?: string;

  /**
   * Custom sortBy key for search params. Defaults to "sortBy".
   */
  sortByKey?: string;

  /**
   * Custom sortOrder key for search params. Defaults to "sortOrder".
   */
  sortOrderKey?: string;

  /**
   * Default sorting to apply when no sort is present in the URL.
   */
  defaultSorting?: SortingState;
};

/**
 *
 * useReactTableSortState is a custom hook that manages the sorting state of a
 * react-table instance. It uses the URL search params to store the sorting
 * state. It returns the sorting state and a function to update the sorting state.
 *
 */
export default function useReactTableSortState(
  options: SortStateOptions = {}
): [SortingState, (newSortBy: Updater<SortingState>) => void] {
  const {
    paramPrefix,
    sortByKey = "sortBy",
    sortOrderKey = "sortOrder",
    defaultSorting
  } = options;

  const sortByParamKey = paramPrefix
    ? `${paramPrefix}__${sortByKey}`
    : sortByKey;
  const sortOrderParamKey = paramPrefix
    ? `${paramPrefix}__${sortOrderKey}`
    : sortOrderKey;
  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get(sortByParamKey) || undefined;
  const sortOrder = searchParams.get(sortOrderParamKey) || undefined;

  const tableSortByState = useMemo(() => {
    if (!sortBy || !sortOrder) {
      return [];
    }
    return [
      {
        id: sortBy,
        desc: sortOrder === "desc"
      }
    ] satisfies SortingState;
  }, [sortBy, sortOrder]);

  useEffect(() => {
    if (
      (!sortBy || !sortOrder) &&
      defaultSorting &&
      defaultSorting.length > 0
    ) {
      const nextParams = new URLSearchParams(window.location.search);
      const [firstSort] = defaultSorting;
      nextParams.set(sortByParamKey, firstSort.id);
      nextParams.set(sortOrderParamKey, firstSort.desc ? "desc" : "asc");
      setSearchParams(nextParams);
    }
  }, [
    defaultSorting,
    setSearchParams,
    sortBy,
    sortOrder,
    sortByParamKey,
    sortOrderParamKey
  ]);

  const updateSortByFn = useCallback(
    (newSortBy: Updater<SortingState>) => {
      const sort =
        typeof newSortBy === "function"
          ? newSortBy([...tableSortByState])
          : newSortBy;
      const nextParams = new URLSearchParams(searchParams);
      if (sort.length === 0) {
        nextParams.delete(sortByParamKey);
        nextParams.delete(sortOrderParamKey);
      } else {
        nextParams.set(sortByParamKey, sort[0].id);
        nextParams.set(sortOrderParamKey, sort[0].desc ? "desc" : "asc");
      }
      setSearchParams(nextParams);
    },
    [
      searchParams,
      setSearchParams,
      sortByParamKey,
      sortOrderParamKey,
      tableSortByState
    ]
  );

  return [tableSortByState, updateSortByFn];
}
