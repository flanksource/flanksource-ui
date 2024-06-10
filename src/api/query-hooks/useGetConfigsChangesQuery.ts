import { configChangesDefaultDateFilter } from "@flanksource-ui/components/Configs/Changes/ConfigChangesFilters/ConfigChangesDateRangeFIlter";
import { useHideDeletedConfigChanges } from "@flanksource-ui/components/Configs/Changes/ConfigsRelatedChanges/FilterBar/ConfigChangesToggledDeletedItems";
import useTimeRangeParams from "@flanksource-ui/ui/TimeRangePicker/useTimeRangeParams";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  CatalogChangesSearchResponse,
  GetConfigsRelatedChangesParams,
  getConfigsChanges
} from "../services/configs";

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
  const configId = params.get("id") ?? undefined;
  const changeSummary = params.get("summary") ?? undefined;
  const source = params.get("source") ?? undefined;
  const createdBy = params.get("created_by") ?? undefined;
  const externalCreatedBy = params.get("external_created_by") ?? undefined;

  const arbitraryFilter = useMemo(() => {
    const filter = new Map<string, string>();
    if (configId) {
      filter.set("id", configId);
    }
    if (changeSummary) {
      filter.set("summary", changeSummary);
    }
    if (source) {
      filter.set("source", source);
    }
    if (createdBy) {
      filter.set("created_by", createdBy);
    }
    if (externalCreatedBy) {
      filter.set("created_by", externalCreatedBy);
    }
    return Object.fromEntries(filter);
  }, [changeSummary, configId, createdBy, externalCreatedBy, source]);

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
    arbitraryFilter
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
    pageSize: pageSize
  } satisfies GetConfigsRelatedChangesParams;

  return useQuery({
    queryKey: ["configs", "changes", props],
    queryFn: () => getConfigsChanges(props),
    ...queryOptions
  });
}
