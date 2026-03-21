import {
  CATALOG_ACCESS_FLAT_TABLE_PREFIX,
  useCatalogAccessUrlState
} from "@flanksource-ui/hooks/useCatalogAccessUrlState";
import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getConfigAccessSummary } from "../services/configAccess";

type ConfigAccessSummaryResponse = Awaited<
  ReturnType<typeof getConfigAccessSummary>
>;

export function useAllConfigAccessSummaryQuery(
  queryOptions: UseQueryOptions<ConfigAccessSummaryResponse> = {
    enabled: true,
    keepPreviousData: true
  }
) {
  const { configType, filters } = useCatalogAccessUrlState();

  const arbitraryFilter = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).filter(([, value]) => Boolean(value))
      ) as Record<string, string>,
    [filters]
  );

  const { pageIndex, pageSize } = useReactTablePaginationState({
    paramPrefix: CATALOG_ACCESS_FLAT_TABLE_PREFIX,
    defaultPageSize: 50
  });

  const [sortBy] = useReactTableSortState({
    paramPrefix: CATALOG_ACCESS_FLAT_TABLE_PREFIX,
    defaultSorting: [{ id: "created_at", desc: true }]
  });

  const sortField = sortBy[0]?.id ?? "created_at";
  const sortOrder = sortBy[0]?.desc ? "desc" : "asc";

  return useQuery({
    queryKey: [
      "config",
      "access-summary",
      "all",
      {
        configType,
        pageIndex,
        pageSize,
        sortField,
        sortOrder,
        arbitraryFilter
      }
    ],
    queryFn: () =>
      getConfigAccessSummary({
        configType,
        pageIndex,
        pageSize,
        sortBy: sortField,
        sortOrder,
        arbitraryFilter
      }),
    ...queryOptions
  });
}
