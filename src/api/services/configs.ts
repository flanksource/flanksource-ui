import {
  tristateOutputToQueryFilterParam,
  tristateOutputToQueryParamValue
} from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { AnyMessageParams } from "yup/lib/types";
import { Catalog, Config, ConfigDB, IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import { PaginationInfo } from "../types/common";
import {
  ConfigAnalysis,
  ConfigChange,
  ConfigHealthCheckView,
  ConfigItem,
  ConfigSummary,
  ConfigTypeRelationships
} from "../types/configs";

export const getAllConfigs = () =>
  resolvePostGrestRequestWithPagination<ConfigItem[]>(ConfigDB.get(`/configs`));

export const getConfigsTags = async () => {
  const res =
    await ConfigDB.get<{ key: string; value: string }[]>("/config_tags");
  return res.data ?? [];
};

export const getAllConfigsMatchingQuery = (query: string) => {
  let url = `/configs?`;
  if (query) {
    url = `${url}&${query}`;
  }
  return resolvePostGrestRequestWithPagination<ConfigItem[]>(
    ConfigDB.get(url, {
      headers: {
        Prefer: "count=exact"
      }
    })
  );
};

export const getAllConfigsForSearchPurpose = async () => {
  let url = `/configs?select=id,name,config_class,type`;
  const res = await resolvePostGrestRequestWithPagination<
    Pick<ConfigItem, "name" | "config_class" | "type" | "id">[]
  >(ConfigDB.get(url));

  return res.data ?? [];
};

type ConfigSummaryRequestChanges = {
  since: string;
};

type ConfigSummaryRequestAnalysis = {
  since: string;
};

export type ConfigSummaryRequest = {
  changes?: ConfigSummaryRequestChanges;
  analysis?: ConfigSummaryRequestAnalysis;
  cost?: string;
  deleted?: boolean;
  filter?: Record<string, string>; // Filter by labels
  groupBy?: string[];
  tags?: string[];
  status?: string;
  health?: string;
};

export const getConfigsSummary = async (request: ConfigSummaryRequest) => {
  const res = await Catalog.post<ConfigSummary[] | undefined>(
    `/summary`,
    request
  );
  return res.data ?? [];
};

export const getConfigsByIDs = async (ids: string[]) => {
  const res = await resolvePostGrestRequestWithPagination<ConfigItem[] | null>(
    ConfigDB.get(
      `/configs?id=in.(${ids.join(",")})&select=id,name,config_class,type`
    )
  );
  return res.data ?? [];
};

export const getConfigsByID = async (id: string) => {
  const res = await resolvePostGrestRequestWithPagination<ConfigItem[] | null>(
    ConfigDB.get(`/configs?id=eq.${id}&select=id,name,config_class,type`)
  );
  if (res.data && res.data.length > 0) {
    return res.data[0];
  }
  return null;
};

export const getAllChanges = (
  queryParams: Record<string, string | undefined>,
  pageIndex?: number,
  pageSize?: number,
  startsAt?: string,
  endsAt?: string
) => {
  const pagingParams =
    pageIndex || pageSize
      ? `&limit=${pageSize}&offset=${pageIndex! * pageSize!}`
      : "";
  let queryString = "";
  Object.keys(queryParams).forEach((key) => {
    if (key === "changeType" && queryParams[key]) {
      queryString = tristateOutputToQueryFilterParam(
        queryParams[key],
        "change_type"
      );
      return;
    }
    if (key === "configType" && queryParams[key]) {
      queryString = tristateOutputToQueryFilterParam(
        queryParams[key],
        "config_type"
      );
      return;
    }
    if (queryParams[key] && queryParams[key] !== "All") {
      const queryKey = key === "type" ? `config.type` : key;
      queryString += `&${queryKey}=eq.${queryParams[key]}`;
    }
  });

  if (startsAt && endsAt) {
    queryString += `&and=(created_at.gte.${startsAt},created_at.lte.${endsAt})`;
  }

  return resolvePostGrestRequestWithPagination(
    ConfigDB.get<ConfigChange[]>(
      `/config_changes_items?order=created_at.desc${pagingParams}&select=id,change_type,summary,source,created_at,config_id,config:config_names!inner(id,name,type)${queryString}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getConfig = (id: string) =>
  resolvePostGrestRequestWithPagination<ConfigItem[]>(
    ConfigDB.get(`/config_detail?id=eq.${id}&select=*,config_scrapers(id,name)`)
  );

export type ConfigsTagList = {
  key: string;
  value: any;
};

export const getConfigTagsList = () => {
  return ConfigDB.get<ConfigsTagList[] | null>(`/config_tags`);
};

export const getConfigLabelsList = () =>
  resolvePostGrestRequestWithPagination<ConfigsTagList[] | null>(
    ConfigDB.get(`/config_labels`)
  );

export const getConfigName = (id: string) =>
  resolvePostGrestRequestWithPagination<ConfigItem[]>(
    ConfigDB.get(`/config_names?id=eq.${id}`)
  );

export const getConfigChanges = (
  id: string,
  pageIndex?: number,
  pageSize?: number,
  starts_at?: string,
  ends_at?: string,
  severity?: string,
  change_type?: string
) => {
  let paginationQueryParams = "";
  if (pageIndex !== undefined && pageSize !== undefined) {
    paginationQueryParams = `&limit=${pageSize}&offset=${
      pageIndex! * pageSize
    }`;
  }
  if (severity) {
    paginationQueryParams += `&severity=eq.${severity}`;
  }
  if (starts_at && ends_at) {
    paginationQueryParams += `&and=(created_at.gte.${starts_at},created_at.lte.${ends_at})`;
  }
  return resolvePostGrestRequestWithPagination(
    ConfigDB.get<ConfigChange[]>(
      `/config_changes?config_id=eq.${id}&order=created_at.desc${paginationQueryParams}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export type CatalogChangesSearchResponse = {
  summary: Record<string, number>;
  changes: ConfigChange[];
  total: number;
};

export type GetConfigsRelatedChangesParams = {
  id?: string;
  type_filter?: "all" | "upstream" | "downstream" | "none";
  include_deleted_configs: boolean;
  changeType?: string;
  severity?: string;
  from?: string;
  to?: string;
  configTypes?: string;
  configType?: string;
  pageSize?: number | string;
  pageIndex?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  arbitraryFilter?: Record<string, string>;
  tags?: {
    key: string;
    value: string;
    exclude?: boolean;
  }[];
};

export async function getConfigsChanges({
  id,
  type_filter,
  include_deleted_configs = false,
  changeType,
  severity,
  from,
  to,
  configTypes,
  configType,
  pageIndex,
  pageSize,
  sortBy,
  sortOrder,
  arbitraryFilter,
  tags
}: GetConfigsRelatedChangesParams) {
  const requestData = new Map<string, any>();
  if (id) {
    requestData.set("id", id);
  }
  if (configTypes && configTypes !== "all") {
    const value = tristateOutputToQueryParamValue(configTypes)
      ?.split(",")
      .map((v) => v.replaceAll("__", "::"))
      .join(",");
    if (value) {
      requestData.set("config_type", value);
    }
  } else if (configType) {
    // if configTypes is not provided, use configType which is a single value
    requestData.set("config_type", configType);
  }
  if (changeType && changeType !== "all") {
    const value = tristateOutputToQueryParamValue(changeType, false);
    if (value) {
      requestData.set("type", value);
    }
  }
  if (arbitraryFilter) {
    Object.entries(arbitraryFilter).forEach(([key, value]) => {
      const filterExpression = tristateOutputToQueryParamValue(
        value,
        key === "summary" || key === "source"
      );
      if (filterExpression) {
        // external_created_by is a special case, we need to convert it to created_by
        const modifyKey = key === "external_created_by" ? "created_by" : key;
        requestData.set(modifyKey, filterExpression);
      }
    });
  }
  if (from) {
    requestData.set("from", from);
  }
  if (to) {
    requestData.set("to", to);
  }
  if (severity) {
    requestData.set("severity", severity);
  }
  if (pageIndex) {
    requestData.set("page", parseInt(pageIndex.toString()) + 1);
  }

  if (pageSize) {
    requestData.set("page_size", pageSize);
  }

  if (sortBy) {
    // for descending order, we need to add a "-" before the sortBy field
    requestData.set("sort_by", `${sortOrder === "desc" ? "-" : ""}${sortBy}`);
  } else {
    requestData.set("sort_by", "-created_at");
  }

  if (tags) {
    const tagList = Object.entries(
      tags.reduce(
        (acc, tag) => {
          acc[tag.key] = acc[tag.key] || [];
          acc[tag.key].push(tag.value);
          return acc;
        },
        {} as Record<string, string[]>
      )
    ).map(([key, values]) => {
      const exclude = tags.find((tag) => tag.key === key)?.exclude;
      if (values.length > 1) {
        const equalSign = exclude ? "notin" : "in";
        return `${key} ${equalSign} (${values.join(",")})`;
      }
      const equalSign = exclude ? "!" : "";
      return `${key}${equalSign}=${values[0]}`;
    });
    requestData.set("tags", tagList.join(","));
  }
  if (type_filter) {
    requestData.set(
      "recursive",
      type_filter === "all" || type_filter === "none" ? "all" : type_filter
    );
    requestData.set("depth", 5);
  } else {
    requestData.set("recursive", "none");
  }

  if (severity) {
    requestData.set("severity", severity);
  }
  requestData.set("include_deleted_configs", include_deleted_configs);
  const res = await Catalog.post<CatalogChangesSearchResponse>(
    `/changes`,
    Object.fromEntries(requestData)
  );
  return res.data ?? [];
}

export const getConfigListFilteredByType = (types: string[]) => {
  return resolvePostGrestRequestWithPagination<
    Pick<ConfigItem, "id" | "name" | "config_class" | "type">[]
  >(
    ConfigDB.get(
      `/config_items?select=id,name,type,config_class${
        // if type is not provided, return all configs
        types.length > 0 ? `&type=in.(${types.join(",")})` : ""
      }`
    )
  );
};

export const getConfigChangeById = async (id: string, configId: string) => {
  const res = await ConfigDB.get<ConfigChange[] | null>(
    `/config_changes?config_id=eq.${configId}&id=eq.${id}&select=id,config_id,change_type,created_at,external_created_by,source,diff,details,patches,created_by,config:configs(id,name,type,config_class)`
  );
  return res.data?.[0] || undefined;
};

type ConfigParams = {
  topologyId?: string;
  configId?: string;
  hideDeleted?: boolean;
};

export const getConfigsBy = ({
  topologyId,
  configId,
  hideDeleted
}: ConfigParams) => {
  const configFields = `id, type, name, config_class, deleted_at`;
  const deletedAt = hideDeleted ? `&deleted_at=is.null` : "";
  if (topologyId) {
    return resolvePostGrestRequestWithPagination<ConfigTypeRelationships[]>(
      ConfigDB.get(
        `/config_component_relationships?component_id=eq.${topologyId}&configs.order=name&select=*,configs!config_component_relationships_config_id_fkey(${configFields})${deletedAt}`
      )
    );
  }
  if (configId) {
    return resolvePostGrestRequestWithPagination(
      ConfigDB.get<ConfigTypeRelationships[]>(
        `/config_relationships?or=(related_id.eq.${configId},config_id.eq.${configId})&configs.order=name&select=*,configs:configs!config_relationships_config_id_fkey(${configFields}),related:configs!config_relationships_related_id_fkey(${configFields})${deletedAt}`
      )
    );
  }
  return Promise.resolve({
    totalEntries: 0,
    data: [],
    error: null
  });
};

type GetAConfigRelationshipsParams = {
  configId: string;
  hideDeleted?: boolean;
  configTypes?: string;
  type_filter?: "all" | "incoming" | "outgoing";
  relation?: "both" | "hard";
  health?: string;
  status?: string;
};

export const getAConfigRelationships = async ({
  configId,
  hideDeleted,
  configTypes,
  type_filter,
  relation,
  health,
  status
}: GetAConfigRelationshipsParams) => {
  if (configId === "") {
    return null;
  }

  const searchParams = new URLSearchParams();
  searchParams.append("config_id", configId);
  searchParams.append("include_deleted_configs", `${!hideDeleted}`);
  searchParams.append("max_depth", "10");

  if (configTypes) {
    const value = tristateOutputToQueryFilterParam(configTypes, "type")
      ?.split(",")
      .map((v) => v.replaceAll("__", "::"))
      .join(",");

    if (value) {
      const [key, values] = value.split("=");
      searchParams.append(key.replace("&", ""), values);
    }
  }

  if (status) {
    const value = tristateOutputToQueryFilterParam(status, "status");
    if (value) {
      const [key, values] = value.split("=");
      searchParams.append(key.replace("&", ""), values);
    }
  }

  if (health) {
    const value = tristateOutputToQueryFilterParam(health, "health");
    if (value) {
      const [key, values] = value.split("=");
      searchParams.append(key.replace("&", ""), values);
    }
  }

  if (type_filter) {
    searchParams.append("type_filter", type_filter);
  }

  if (type_filter === "incoming" || type_filter === "all") {
    if (relation) {
      searchParams.append("incoming_relation", relation);
    }
  }

  if (type_filter === "outgoing" || type_filter === "all") {
    if (relation) {
      searchParams.append("outgoing_relation", relation);
    }
  }

  const res = await ConfigDB.get<ConfigItem[]>(
    `/rpc/related_configs_recursive?${searchParams.toString()}`
  );

  return res.data ?? [];
};

export const getConfigChecks = async (configId: string) => {
  const res = await IncidentCommander.get<ConfigHealthCheckView[]>(
    `/check_summary_for_config?config_id=eq.${configId}`
  );
  return res.data ?? [];
};

export const addManualComponentConfigRelationship = (
  topologyId: string,
  configId: string
) => {
  return resolvePostGrestRequestWithPagination(
    ConfigDB.post(`/config_component_relationships`, {
      component_id: topologyId,
      config_id: configId,
      selector_id: "manual"
    })
  );
};

export const removeManualComponentConfigRelationship = (
  topologyId: string,
  configId: string
) => {
  return resolvePostGrestRequestWithPagination(
    ConfigDB.delete(
      `/config_component_relationships?component_id=eq.${topologyId}&config_id=eq.${configId}&selector_id=eq.manual`
    )
  );
};

export const searchConfigs = (type: string, input: string) => {
  const orCondition = input
    ? `&or=(name.ilike.*${input}*,external_id.ilike.*${input}*)`
    : "";
  return resolvePostGrestRequestWithPagination<ConfigItem[]>(
    ConfigDB.get(
      `/configs?select=id,external_id,name,type,analysis,changes&type=ilike.${type}${orCondition}`
    )
  );
};

export const createConfigItem = (type: string, params: {}) =>
  resolvePostGrestRequestWithPagination<ConfigItem>(
    ConfigDB.post(`/config_item`, {
      type: type,
      ...params
    })
  );

export const updateConfigItem = (id: string, params: {}) =>
  resolvePostGrestRequestWithPagination<ConfigItem>(
    ConfigDB.patch(`/config_item?id=eq.${id}`, { ...params })
  );

export const deleteConfigItem = (id: string) =>
  resolvePostGrestRequestWithPagination(
    ConfigDB.delete(`/config_item?id=eq.${id}`)
  );

// Saved Queries

export const getAllSavedQueries = () =>
  resolvePostGrestRequestWithPagination(
    ConfigDB.get<AnyMessageParams>(`/saved_query`)
  );

export const getSavedQuery = (id: string) =>
  resolvePostGrestRequestWithPagination(
    ConfigDB.get(`/saved_query?id=eq.${id}`)
  );

export const createSavedQuery = (query: string, params: any) =>
  resolvePostGrestRequestWithPagination(
    ConfigDB.post(`/saved_query`, {
      query,
      ...params
    })
  );

export const updateSavedQuery = (id: string, params: any) =>
  resolvePostGrestRequestWithPagination(
    ConfigDB.patch(`/saved_query?id=eq.${id}`, { ...params })
  );

export const deleteSavedQuery = (id: string) =>
  resolvePostGrestRequestWithPagination(
    ConfigDB.delete(`/saved_query?id=eq.${id}`)
  );

export const getConfigsByQuery = async (query: string) => {
  const { data, error } = await resolvePostGrestRequestWithPagination<{
    results: { tags: any }[];
  }>(Config.get(`/query?query=${query}`));
  if (error) {
    console.error(error);
    return [];
  }

  return (data?.results || []).map((d) => ({
    ...d,
    tags: JSON.parse(d.tags)
  }));
};

export type ConfigTypeItem = {
  type: string;
};

export const getConfigsTypes = async () => {
  const res = await IncidentCommander.get<ConfigTypeItem[] | null>(
    `/config_types`
  );
  return res.data;
};

export type ConfigStatusesItem = {
  status: string;
};

export const getConfigsStatusesItems = async () => {
  const res = await IncidentCommander.get<ConfigStatusesItem[] | null>(
    `/config_statuses`
  );
  return res.data ?? [];
};

export type ConfigAnalysisTypeItem = {
  analysis_type: string;
};

export const getConfigsAnalysisTypesFilter = async () => {
  const res = await IncidentCommander.get<ConfigAnalysisTypeItem[] | null>(
    `/analysis_types`
  );
  return res.data;
};

export type ConfigAnalysisAnalyzerItem = {
  analyzer: string;
};

export const getConfigsAnalysisAnalyzers = async () => {
  const res = await IncidentCommander.get<ConfigAnalysisAnalyzerItem[] | null>(
    `/config_analysis_analyzers?order=analyzer.asc`
  );
  return res.data ?? [];
};

export type ConfigChangesTypeItem = {
  change_type: string;
};

export const getConfigsChangesTypesFilter = async () => {
  const res = await IncidentCommander.get<ConfigChangesTypeItem[] | null>(
    `/change_types?change_type=not.eq.`
  );
  return res.data;
};

export const getConfigInsights = (
  configId: string,
  pageIndex?: number,
  pageSize?: number
) => {
  let paginationQueryParams = "";
  if (pageIndex !== undefined && pageSize !== undefined) {
    paginationQueryParams = `&limit=${pageSize}&offset=${
      pageIndex! * pageSize
    }`;
  }
  return resolvePostGrestRequestWithPagination(
    ConfigDB.get<
      Pick<
        ConfigAnalysis,
        | "id"
        | "analyzer"
        | "config"
        | "severity"
        | "analysis_type"
        | "message"
        | "sanitizedMessageTxt"
        | "sanitizedMessageHTML"
        | "first_observed"
      >[]
    >(
      `/config_analysis?select=id,analyzer,analysis_type,message,severity,analysis,first_observed,config:configs(id,name,config_class,type)&config_id=eq.${configId}${paginationQueryParams}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getConfigInsightsByID = async (id: string) => {
  const res = await ConfigDB.get<ConfigAnalysis[] | null>(
    `/config_analysis?select=id,source,analyzer,analysis_type,message,severity,status,analysis,first_observed,config:configs(id,name,config_class,type)&id=eq.${id}`,
    {
      headers: {
        Prefer: "count=exact"
      }
    }
  );
  return res.data?.[0] ?? null;
};

export const getTopologyRelatedInsights = async (
  id: string,
  pageIndex?: number,
  pageSize?: number
) => {
  let paginationQueryParams = "";
  if (pageIndex !== undefined && pageSize !== undefined) {
    paginationQueryParams = `&limit=${pageSize}&offset=${
      pageIndex! * pageSize
    }`;
  }

  return resolvePostGrestRequestWithPagination(
    ConfigDB.get<
      | {
          analysis_id: string;
          config: {
            id: string;
            name: string;
            config_class: string;
            type: string;
            analysis: Pick<
              ConfigAnalysis,
              | "id"
              | "analyzer"
              | "config"
              | "severity"
              | "analysis_type"
              | "sanitizedMessageTxt"
              | "sanitizedMessageHTML"
              | "first_observed"
              | "message"
            >[];
          };
        }[]
      | null
    >(
      `/analysis_by_component?component_id=eq.${id}${paginationQueryParams}&select=analysis_id,config:configs(id,name,config_class,type,analysis:config_analysis(id,analyzer,analysis_type,message,severity,analysis,first_observed))`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getConfigInsight = async <T>(
  configId: string,
  configInsightId: string
) => {
  const res = await ConfigDB.get<T>(
    `/config_analysis?select=id,message,analyzer,config:configs(id,name,config_class,type)&config_id=eq.${configId}&id=eq.${configInsightId}`
  );
  return res.data;
};

export const getAllConfigInsights = async (
  queryParams: {
    status?: string;
    type?: string;
    severity?: string;
    analyzer?: string;
    component?: string;
    configId?: string;
    configType?: string;
  },
  sortBy: { sortBy?: string; sortOrder?: "asc" | "desc" },
  { pageIndex, pageSize }: PaginationInfo
) => {
  const pagingParams = `&limit=${pageSize}&offset=${pageIndex * pageSize}`;

  const { status, type, severity, analyzer, component, configId, configType } =
    queryParams;

  const params = {
    status: status && `&status=eq.${status}`,
    type: type && `&analysis_type=eq.${type}`,
    severity: severity && `&severity=eq.${severity}`,
    analyzer: analyzer && `&analyzer=eq.${analyzer}`,
    component: component && `&component_id=eq.${component}`,
    configId: configId && `&config_id=eq.${configId}`,
    configType: configType && `&config_type=eq.${configType}`
  };

  const queryParamsString = Object.values(params)
    .filter((value) => !!value)
    .join("");

  const sortString = sortBy.sortBy
    ? `&order=${sortBy.sortBy}.${sortBy.sortOrder}`
    : // default sort by first_observed
      "&order=first_observed.desc";

  return resolvePostGrestRequestWithPagination(
    ConfigDB.get<ConfigAnalysis[] | null>(
      `/config_analysis_items?select=id,analysis_type,analyzer,severity,status,first_observed,last_observed,config:configs(id,name,config_class,type)${pagingParams}${queryParamsString}${sortString}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getConfigAnalysis = async <T>(configId: string) => {
  const res = await ConfigDB.get<T>(
    `/configs?id=eq.${configId}&select=cost_per_minute,cost_total_1d,cost_total_7d,cost_total_30d`
  );
  return res.data;
};

export const getConfigComponentRelationships = async <T>(configID: string) => {
  const res = await ConfigDB.get<T>(
    `/config_component_relationships?config_id=eq.${configID}&select=components!config_component_relationships_component_id_fkey(id, icon, name)`
  );
  return res.data;
};

export const getComponentConfigChanges = async (topologyID: string) => {
  const res = await ConfigDB.get<ConfigChange[]>(
    `/changes_by_component?component_id=eq.${topologyID}&select=id,type,config_id,name,change_type,config_class,created_at:configs(id, name, type, config_class)`
  );
  return res.data;
};

export const getConfigAnalysisByComponent = async (componentId: string) => {
  const res = await ConfigDB.get<ConfigAnalysis[]>(
    `/rpc/lookup_analysis_by_component?id=${componentId}`
  );
  return res.data;
};
