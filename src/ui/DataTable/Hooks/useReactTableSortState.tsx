import { SortingState, Updater } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 *
 * useReactTableSortState is a custom hook that manages the sorting state of a
 * react-table instance. It uses the URL search params to store the sorting
 * state. It returns the sorting state and a function to update the sorting state.
 *
 */
export default function useReactTableSortState(
  sortByKey = "sortBy",
  sortOrderKey = "sortOrder"
): [SortingState, (newSortBy: Updater<SortingState>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

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
      const sort = typeof newSortBy === "function" ? newSortBy([]) : newSortBy;
      if (sort.length === 0) {
        searchParams.delete(sortByKey);
        searchParams.delete(sortOrderKey);
      } else {
        searchParams.set(sortByKey, sort[0]?.id);
        searchParams.set(sortOrderKey, sort[0].desc ? "desc" : "asc");
      }
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams, sortByKey, sortOrderKey]
  );

  return [tableSortByState, updateSortByFn];
}
