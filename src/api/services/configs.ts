// http://incident-commander.canary.lab.flanksource.com/config/db

import { ConfigTypeChanges } from "../../components/ConfigChanges";
import { Config, ConfigDB, IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export interface ConfigItem {
  name: string;
  external_id: string;
  config_type: string;
  external_type?: string;
  id: string;
  changes: Change[];
  analysis: Analysis[];
  type: string;
  tags?: Record<string, any>;
  allTags?: Record<string, any>;
  created_at: string;
  updated_at: string;
  cost_per_minute?: number;
  cost_total_1d?: number;
  cost_total_7d?: number;
  cost_total_30d?: number;
  config?: any;
}

export type ConfigTypeRelationships = {
  config_id: string;
  related_id: string;
  property: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  selector_id: string;
  configs: ConfigItem;
  related: ConfigItem;
};

interface Change {
  type: string;
  count: number;
}

interface Analysis {
  category: string;
  severity: string;
  description: string;
  analysis_type: string;
  analyzer: string;
}

// Config Items

export const getAllConfigs = () =>
  resolve<ConfigItem[]>(ConfigDB.get(`/configs`));

export const getAllConfigsMatchingQuery = (query: string) => {
  let url = `/configs`;
  if (query) {
    url = `${url}?${query}`;
  }
  return resolve<ConfigItem[]>(ConfigDB.get(url));
};

export const getAllChanges = () =>
  resolve(
    ConfigDB.get<ConfigTypeChanges[]>(`/config_changes?order=created_at.desc`)
  );

export const getConfig = (id: string) =>
  resolve<ConfigItem[]>(ConfigDB.get(`/config_items?id=eq.${id}`));

export const getConfigName = (id: string) =>
  resolve<ConfigItem[]>(ConfigDB.get(`/config_names?id=eq.${id}`));

export const getConfigChange = (id: string) =>
  resolve(
    ConfigDB.get<ConfigTypeChanges[]>(
      `/config_changes?config_id=eq.${id}&order=created_at.desc`
    )
  );

type ConfigParams = {
  topologyId?: string;
  configId?: string;
};

export const getConfigsBy = ({ topologyId, configId }: ConfigParams) => {
  if (topologyId) {
    return resolve<ConfigItem[]>(
      ConfigDB.get(
        `/config_component_relationships?component_id=eq.${topologyId}&select=*,configs!config_component_relationships_config_id_fkey(*)`
      )
    );
  } else if (configId) {
    return resolve(
      ConfigDB.get<ConfigTypeRelationships[]>(
        `/config_relationships?or=(related_id.eq.${configId},config_id.eq.${configId})&select=*,configs:configs!config_relationships_config_id_fkey(*),related:configs!config_relationships_related_id_fkey(*)`
      )
    );
  }
};

export const searchConfigs = (type: string, input: string) => {
  const orCondition = input
    ? `&or=(name.ilike.*${input}*,external_id.ilike.*${input}*)`
    : "";
  return resolve<ConfigItem[]>(
    ConfigDB.get(
      `/configs?select=id,external_id,name,config_type,analysis,changes&config_type=ilike.${type}${orCondition}`
    )
  );
};

export const createConfigItem = (type: string, params: {}) =>
  resolve<ConfigItem>(
    ConfigDB.post(`/config_item`, {
      config_type: type,
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

export const getAllSavedQueries = () => resolve(ConfigDB.get(`/saved_query`));

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

export const getRelatedConfigs = async (configID: string) => {
  const res = await ConfigDB.get<ConfigTypeRelationships[]>(
    `/config_relationships?or=(related_id.eq.${configID},config_id.eq.${configID})&select=*,configs:configs!config_relationships_config_id_fkey(*),related:configs!config_relationships_related_id_fkey(*)`
  );
  return res.data;
};

export type ConfigTypeItem = {
  config_type: string;
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

export type ConfigChangesTypeItem = {
  change_type: string;
};

export const getConfigsChangesTypesFilter = async () => {
  const res = await IncidentCommander.get<ConfigChangesTypeItem[] | null>(
    `/change_types`
  );
  return res.data;
};

export const getConfigInsights = async <T>(configId: string) => {
  const res = await ConfigDB.get<T>(
    `/config_analysis?config_id=eq.${configId}`
  );
  return res.data;
};

export const getConfigInsight = async <T>(
  configId: string,
  configInsightId: string
) => {
  const res = await ConfigDB.get<T>(
    `/config_analysis?config_id=eq.${configId}&id=eq.${configInsightId}`
  );
  return res.data;
};
