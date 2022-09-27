// http://incident-commander.canary.lab.flanksource.com/config/db

import { Config, ConfigDB } from "../axios";
import { resolve } from "../resolve";

interface ConfigItem {
  name: string;
  external_id: string;
  config_type: string;
  id: string;
  changes: Change[];
  analysis: Analysis[];
}

interface Change {
  type: string;
  count: number;
}

interface Analysis {
  category: string;
  severity: string;
  description: string;
}

// Config Items

export const getAllConfigs = () =>
  resolve<ConfigItem[]>(ConfigDB.get(`/configs`));

export const getAllChanges = () =>
  resolve(ConfigDB.get(`/config_changes?order=created_at.desc`));

export const getConfig = (id: string) =>
  resolve<ConfigItem[]>(
    ConfigDB.get(`/config_items
  ?id=eq.${id}`)
  );

export const getConfigChange = (id: string) =>
  resolve(
    ConfigDB.get(`/config_changes?config_id=eq.${id}&order=created_at.desc`)
  );

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
