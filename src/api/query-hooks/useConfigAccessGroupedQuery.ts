import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { useQuery } from "@tanstack/react-query";
import {
  getConfigAccessSummaryByUser,
  getConfigAccessSummaryByConfig
} from "../services/configAccess";

function useGroupedPaginationAndSort() {
  const { pageIndex, pageSize } = useReactTablePaginationState({
    defaultPageSize: 50
  });

  const [sortBy] = useReactTableSortState({
    defaultSorting: [{ id: "access_count", desc: true }]
  });

  const sortField = sortBy[0]?.id ?? "access_count";
  const sortOrder = (sortBy[0]?.desc ? "desc" : "asc") as "asc" | "desc";

  return { pageIndex, pageSize, sortField, sortOrder };
}

export function useConfigAccessGroupedByUserQuery() {
  const { pageIndex, pageSize, sortField, sortOrder } =
    useGroupedPaginationAndSort();

  return useQuery(
    [
      "config",
      "access-summary",
      "grouped",
      "user",
      { pageIndex, pageSize, sortField, sortOrder }
    ],
    () =>
      getConfigAccessSummaryByUser({
        pageIndex,
        pageSize,
        sortBy: sortField,
        sortOrder
      }),
    {
      keepPreviousData: true
    }
  );
}

export function useConfigAccessGroupedByConfigQuery() {
  const { pageIndex, pageSize, sortField, sortOrder } =
    useGroupedPaginationAndSort();

  return useQuery(
    [
      "config",
      "access-summary",
      "grouped",
      "config",
      { pageIndex, pageSize, sortField, sortOrder }
    ],
    () =>
      getConfigAccessSummaryByConfig({
        pageIndex,
        pageSize,
        sortBy: sortField,
        sortOrder
      }),
    {
      keepPreviousData: true
    }
  );
}
