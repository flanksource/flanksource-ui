import useReactTablePaginationState from "@flanksource-ui/ui/DataTable/Hooks/useReactTablePaginationState";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [params] = useSearchParams();
  const configType = params.get("configType") ?? undefined;

  const configIdFilter = params.get("config_id") ?? undefined;
  const userFilter = params.get("user") ?? undefined;
  const roleFilter = params.get("role") ?? undefined;

  const arbitraryFilter = useMemo(() => {
    const filter = new Map<string, string>();

    if (configIdFilter) {
      filter.set("config_id", configIdFilter);
    }

    if (userFilter) {
      filter.set("user", userFilter);
    }

    if (roleFilter) {
      filter.set("role", roleFilter);
    }

    return Object.fromEntries(filter);
  }, [configIdFilter, roleFilter, userFilter]);

  const { pageIndex, pageSize } = useReactTablePaginationState({
    defaultPageSize: 50
  });

  const [sortBy] = useReactTableSortState({
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
