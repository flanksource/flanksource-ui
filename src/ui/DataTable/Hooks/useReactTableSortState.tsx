import { SortingState, Updater } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";

import { usePrefixedSearchParams } from "../../../hooks/usePrefixedSearchParams";

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

  const defaultSort = defaultSorting?.[0];

  const [searchParams, setSearchParams] = usePrefixedSearchParams(
    paramPrefix,
    false,
    defaultSort
      ? {
          [sortByKey]: defaultSort.id,
          [sortOrderKey]: defaultSort.desc ? "desc" : "asc"
        }
      : undefined
  );

  const sortBy = searchParams.get(sortByKey) || undefined;
  const sortOrder = searchParams.get(sortOrderKey) || undefined;

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

  const updateSortByFn = useCallback(
    (newSortBy: Updater<SortingState>) => {
      setSearchParams((current) => {
        const currentSortBy = current.get(sortByKey) || undefined;
        const currentSortOrder = current.get(sortOrderKey) || undefined;

        const currentTableSortByState =
          currentSortBy && currentSortOrder
            ? ([
                {
                  id: currentSortBy,
                  desc: currentSortOrder === "desc"
                }
              ] satisfies SortingState)
            : [];

        const sort =
          typeof newSortBy === "function"
            ? newSortBy(currentTableSortByState)
            : newSortBy;

        const nextParams = new URLSearchParams(current);
        if (sort.length === 0) {
          nextParams.delete(sortByKey);
          nextParams.delete(sortOrderKey);
        } else {
          nextParams.set(sortByKey, sort[0].id);
          nextParams.set(sortOrderKey, sort[0].desc ? "desc" : "asc");
        }

        return nextParams;
      });
    },
    [setSearchParams, sortByKey, sortOrderKey]
  );

  return [tableSortByState, updateSortByFn];
}
