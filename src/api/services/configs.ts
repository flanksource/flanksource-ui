import { AnyMessageParams } from "yup/lib/types";
import { Config, ConfigDB, IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { PaginationInfo } from "../types/common";
import {
  ConfigAnalysis,
  ConfigChange,
  ConfigItem,
  ConfigSummary,
  ConfigTypeRelationships
} from "../types/configs";

export const getAllConfigs = () =>
  resolve<ConfigItem[]>(ConfigDB.get(`/configs`));

export const getAllConfigsMatchingQuery = (query: string) => {
  let url = `/configs?`;
  if (query) {
    url = `${url}&${query}`;
  }
  return resolve<ConfigItem[]>(ConfigDB.get(url));
};

export const getAllConfigsForSearchPurpose = async () => {
  let url = `/configs?select=id,name,config_class,type`;
  const res = await resolve<
    Pick<ConfigItem, "name" | "config_class" | "type" | "id">[]
  >(ConfigDB.get(url));

  return res.data ?? [];
};

export const getConfigsSummary = async () => {
  const res = await resolve<ConfigSummary[] | null>(
    ConfigDB.get(`/config_summary`)
  );
  return res.data ?? [];
};

export const getConfigsByIDs = async (ids: string[]) => {
  const res = await resolve<ConfigItem[] | null>(
    ConfigDB.get(
      `/configs?id=in.(${ids.join(",")})&select=id,name,config_class,type`
    )
  );
  return res.data ?? [];
};

export const getConfigsByID = async (id: string) => {
  const res = await resolve<ConfigItem[] | null>(
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
  starts_at?: string,
  ends_at?: string
) => {
  const pagingParams =
    pageIndex || pageSize
      ? `&limit=${pageSize}&offset=${pageIndex! * pageSize!}`
      : "";
  let queryString = "";
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] && queryParams[key] !== "All") {
      const queryKey = key === "type" ? `config.type` : key;
      queryString += `&${queryKey}=eq.${queryParams[key]}`;
    }
  });

  if (starts_at && ends_at) {
    queryString += `&created_at=gte.${starts_at}&created_at=lte.${ends_at}`;
  }

  return resolve(
    ConfigDB.get<ConfigChange[]>(
      `/config_changes?order=created_at.desc${pagingParams}&select=id,change_type,summary,source,created_at,config_id,config:config_names!inner(id,name,type)${queryString}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getConfig = (id: string) =>
  resolve<ConfigItem[]>(
    ConfigDB.get(`/config_detail?id=eq.${id}&select=*,config_scrapers(id,name)`)
  );

export type ConfigsTagList = {
  key: string;
  value: any;
};

export const getConfigTagsList = () =>
  resolve<ConfigsTagList[] | null>(ConfigDB.get(`/config_tags`));

export const getConfigName = (id: string) =>
  resolve<ConfigItem[]>(ConfigDB.get(`/config_names?id=eq.${id}`));

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
  if (change_type) {
    paginationQueryParams += `&change_type=eq.${change_type}`;
  }
  if (starts_at && ends_at) {
    paginationQueryParams += `&created_at=gte.${starts_at}&created_at=lte.${ends_at}`;
  }
  return resolve(
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

export const getConfigListFilteredByType = (types: string[]) => {
  return resolve<Pick<ConfigItem, "id" | "name" | "config_class" | "type">[]>(
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
    return resolve<ConfigTypeRelationships[]>(
      ConfigDB.get(
        `/config_component_relationships?component_id=eq.${topologyId}&configs.order=name&select=*,configs!config_component_relationships_config_id_fkey(${configFields})${deletedAt}`
      )
    );
  }
  if (configId) {
    return resolve(
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

export const getDetailedConfigRelationships = ({
  configId,
  hideDeleted
}: {
  configId: string;
  hideDeleted?: boolean;
}) => {
  const configFields = `id, type, changes, cost_per_minute, cost_total_1d, cost_total_7d, cost_total_30d, name, config_class, updated_at, created_at, tags, analysis, deleted_at`;
  const deletedAt = hideDeleted ? `&deleted_at=is.null` : "";

  return resolve(
    ConfigDB.get<ConfigTypeRelationships[]>(
      `/config_relationships?or=(related_id.eq.${configId},config_id.eq.${configId})&configs.order=name&select=*,configs:configs!config_relationships_config_id_fkey(${configFields}),related:configs!config_relationships_related_id_fkey(${configFields})${deletedAt}`
    )
  );
};

export const addManualComponentConfigRelationship = (
  topologyId: string,
  configId: string
) => {
  return resolve(
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
  return resolve(
    ConfigDB.delete(
      `/config_component_relationships?component_id=eq.${topologyId}&config_id=eq.${configId}&selector_id=eq.manual`
    )
  );
};

export const searchConfigs = (type: string, input: string) => {
  const orCondition = input
    ? `&or=(name.ilike.*${input}*,external_id.ilike.*${input}*)`
    : "";
  return resolve<ConfigItem[]>(
    ConfigDB.get(
      `/configs?select=id,external_id,name,type,analysis,changes&type=ilike.${type}${orCondition}`
    )
  );
};

export const createConfigItem = (type: string, params: {}) =>
  resolve<ConfigItem>(
    ConfigDB.post(`/config_item`, {
      type: type,
      ...params
    })
  );

export const updateConfigItem = (id: string, params: {}) =>
  resolve<ConfigItem>(
    ConfigDB.patch(`/config_item?id=eq.${id}`, { ...params })
  );

export const deleteConfigItem = (id: string) =>
  resolve(ConfigDB.delete(`/config_item?id=eq.${id}`));

// Saved Queries

export const getAllSavedQueries = () =>
  resolve(ConfigDB.get<AnyMessageParams>(`/saved_query`));

export const getSavedQuery = (id: string) =>
  resolve(ConfigDB.get(`/saved_query?id=eq.${id}`));

export const createSavedQuery = (query: string, params: any) =>
  resolve(
    ConfigDB.post(`/saved_query`, {
      query,
      ...params
    })
  );

export const updateSavedQuery = (id: string, params: any) =>
  resolve(ConfigDB.patch(`/saved_query?id=eq.${id}`, { ...params }));

export const deleteSavedQuery = (id: string) =>
  resolve(ConfigDB.delete(`/saved_query?id=eq.${id}`));

export const getConfigsByQuery = async (query: string) => {
  const { data, error } = await resolve<{ results: { tags: any }[] }>(
    Config.get(`/query?query=${query}`)
  );
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
    `/change_types`
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
  return resolve(
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

  return resolve(
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
  },
  sortBy: { sortBy?: string; sortOrder?: "asc" | "desc" },
  { pageIndex, pageSize }: PaginationInfo
) => {
  const pagingParams = `&limit=${pageSize}&offset=${pageIndex * pageSize}`;

  const { status, type, severity, analyzer, component, configId } = queryParams;

  const params = {
    status: status && `&status=eq.${status}`,
    type: type && `&analysis_type=eq.${type}`,
    severity: severity && `&severity=eq.${severity}`,
    analyzer: analyzer && `&analyzer=eq.${analyzer}`,
    component: component && `&component_id=eq.${component}`,
    configId: configId && `&config_id=eq.${configId}`
  };

  const queryParamsString = Object.values(params)
    .filter((value) => !!value)
    .join("");

  const sortString = sortBy.sortBy
    ? `&order=${sortBy.sortBy}.${sortBy.sortOrder}`
    : // default sort by first_observed
      "&order=first_observed.desc";

  return resolve(
    ConfigDB.get<ConfigAnalysis[] | null>(
      `/config_analysis?select=id,analysis_type,analyzer,severity,status,first_observed,last_observed,config:configs(id,name,config_class,type)${pagingParams}${queryParamsString}${sortString}`,
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
