import { configChangesDefaultDateFilter } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesDateRangeFIlter";
import { useHideDeletedConfigChanges } from "@flanksource-ui/components/Configs/Changes/ConfigsRelatedChanges/FilterBar/ConfigChangesToggledDeletedItems";
import { useConfigChangesArbitraryFilters } from "@flanksource-ui/hooks/useConfigChangesArbitraryFilters";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  CatalogChangesSearchResponse,
  GetConfigsRelatedChangesParams,
  getConfigsChanges
} from "../services/configs";

function useConfigChangesTagsFilter() {
  const [params] = useSearchParams();

  const tags = useMemo(() => {
    const allTags = params.get("tags");
    if (allTags) {
      return allTags.split(",").map((tag) => {
        const exclude = tag.split(":")[1] === "-1" ? true : false; // expected: `key____value:-1`
        const key = `${tag.split("____")[0]}`; // expected: `key____value:-1`
        const value = tag.split("____")[1].split(":")[0]; // expected: `key____value:-1`
        return {
          key,
          value,
          exclude
        } satisfies Required<GetConfigsRelatedChangesParams>["tags"][number];
      });
    }
  }, [params]);

  return tags;
}

export function useGetAllConfigsChangesQuery(
  queryOptions: UseQueryOptions<CatalogChangesSearchResponse> = {
    enabled: true,
    keepPreviousData: true
  }
) {
  const hideDeletedConfigChanges = useHideDeletedConfigChanges();
  const { timeRangeValue } = useTimeRangeParams(configChangesDefaultDateFilter);
  const [params] = useSearchParams({
    sortBy: "created_at",
    sortDirection: "desc"
  });
  const changeType = params.get("changeType") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const configType = params.get("configType") ?? undefined;
  const from = timeRangeValue?.from ?? undefined;
  const to = timeRangeValue?.to ?? undefined;
  const sortBy = params.get("sortBy") ?? undefined;
  const sortDirection = params.get("sortDirection") ?? "desc";
  const configTypes = params.get("configTypes") ?? "all";
  const page = params.get("page") ?? "1";
  const pageSize = params.get("pageSize") ?? "200";

  const tags = useConfigChangesTagsFilter();

  const arbitraryFilter = useConfigChangesArbitraryFilters();

  const props = {
    include_deleted_configs: !hideDeletedConfigChanges,
    changeType,
    severity,
    from,
    to,
    configTypes,
    configType,
    sortBy,
    sortOrder: sortDirection === "desc" ? "desc" : "asc",
    page: page,
    pageSize: pageSize,
    arbitraryFilter,
    tags
  } satisfies GetConfigsRelatedChangesParams;

  return useQuery({
    queryKey: ["configs", "changes", props],
    queryFn: () => getConfigsChanges(props),
    ...queryOptions
  });
}

export function useGetConfigChangesByIDQuery(
  queryOptions: UseQueryOptions<CatalogChangesSearchResponse> = {
    enabled: true,
    keepPreviousData: true
  }
) {
  const { id } = useParams();
  const hideDeletedConfigChanges = useHideDeletedConfigChanges();
  const { timeRangeValue } = useTimeRangeParams(configChangesDefaultDateFilter);
  const [params] = useSearchParams({
    downstream: "true",
    upstream: "false",
    sortBy: "created_at",
    sortDirection: "desc"
  });
  const change_type = params.get("changeType") ?? undefined;
  const severity = params.get("severity") ?? undefined;
  const from = timeRangeValue?.from ?? undefined;
  const to = timeRangeValue?.to ?? undefined;
  const sortBy = params.get("sortBy") ?? undefined;
  const sortDirection = params.get("sortDirection") ?? "desc";
  const configTypes = params.get("configTypes") ?? "all";
  const page = params.get("page") ?? "1";
  const pageSize = params.get("pageSize") ?? "200";
  const upstream = params.get("upstream") === "true";
  const downstream = params.get("downstream") === "true";
  const all = upstream && downstream;

  const arbitraryFilter = useConfigChangesArbitraryFilters();

  const tags = useConfigChangesTagsFilter();

  const relationshipType = useMemo(() => {
    if (all) {
      return "all";
    }
    if (upstream) {
      return "upstream";
    }
    if (downstream) {
      return "downstream";
    }
    return undefined;
  }, [all, upstream, downstream]);

  const props = {
    id,
    type_filter: relationshipType,
    include_deleted_configs: hideDeletedConfigChanges,
    changeType: change_type,
    severity,
    from,
    to,
    configTypes,
    sortBy,
    sortOrder: sortDirection === "desc" ? "desc" : "asc",
    page: page,
    pageSize: pageSize,
    tags,
    arbitraryFilter
  } satisfies GetConfigsRelatedChangesParams;

  return useQuery({
    queryKey: ["configs", "changes", props],
    queryFn: () => getConfigsChanges(props),
    ...queryOptions
  });
}
