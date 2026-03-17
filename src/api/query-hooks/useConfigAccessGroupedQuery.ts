import {
  CATALOG_ACCESS_GROUP_CONFIG_TABLE_PREFIX,
  CATALOG_ACCESS_GROUP_USER_TABLE_PREFIX
} from "@flanksource-ui/hooks/useCatalogAccessUrlState";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { useQuery } from "@tanstack/react-query";
import {
  getConfigAccessSummaryByUser,
  getConfigAccessSummaryByConfig
} from "../services/configAccess";

function useGroupedPaginationAndSort(paramPrefix: string) {
  const { pageIndex, pageSize } = useReactTablePaginationState({
    paramPrefix,
    defaultPageSize: 50
  });

  const [sortBy] = useReactTableSortState({
    paramPrefix,
    defaultSorting: [{ id: "access_count", desc: true }]
  });

  const sortField = sortBy[0]?.id ?? "access_count";
  const sortOrder = (sortBy[0]?.desc ? "desc" : "asc") as "asc" | "desc";

  return { pageIndex, pageSize, sortField, sortOrder };
}

export function useConfigAccessGroupedByUserQuery() {
  const { pageIndex, pageSize, sortField, sortOrder } =
    useGroupedPaginationAndSort(CATALOG_ACCESS_GROUP_USER_TABLE_PREFIX);

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
    useGroupedPaginationAndSort(CATALOG_ACCESS_GROUP_CONFIG_TABLE_PREFIX);

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
