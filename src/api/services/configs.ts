// http://incident-commander.canary.lab.flanksource.com/config/db

import { Config, ConfigDB } from "../axios";
import { resolve } from "../resolve";

// Config Items

export const getAllConfigs = () => resolve(ConfigDB.get(`/config_item`));

export const getAllChanges = () =>
  resolve(ConfigDB.get(`/config_change?order=created_at.desc`));

export const getConfig = (id: string) =>
  resolve(ConfigDB.get(`/config_item?id=eq.${id}`));

export const getConfigChange = (id: string) =>
  resolve(
    ConfigDB.get(`/config_change?config_id=eq.${id}&order=created_at.desc`)
  );

interface ConfigItem {
  name: string;
  external_id: string;
  config_type: string;
  id: string;
}

export const searchConfigs = (
  type: string,
  input: string
): Promise<{ data: ConfigItem[] }> =>
  resolve(
    ConfigDB.get(
      `/config_item?select=id,external_id,name,config_type&config_type=ilike.${type}&or=(name.ilike.*${input}*,external_id.ilike.*${input}*)`
    )
  );

export const createConfigItem = (type: string, params: {}) =>
  resolve(
    ConfigDB.post(`/config_item`, {
      config_type: type,
      ...params
    })
  );

export const updateConfigItem = (id: string, params: {}) =>
  resolve(ConfigDB.patch(`/config_item?id=eq.${id}`, { ...params }));

export const deleteConfigItem = (id: string) =>
  resolve(ConfigDB.delete(`/config_item?id=eq.${id}`));

// Saved Queries

export const getAllSavedQueries = () => resolve(ConfigDB.get(`/saved_query`));

export const getSavedQuery = (id) =>
  resolve(ConfigDB.get(`/saved_query?id=eq.${id}`));

export const createSavedQuery = (query, params) =>
  resolve(
    ConfigDB.post(`/saved_query`, {
      query,
      ...params
    })
  );

export const updateSavedQuery = (id, params) =>
  resolve(ConfigDB.patch(`/saved_query?id=eq.${id}`, { ...params }));

export const deleteSavedQuery = (id) =>
  resolve(ConfigDB.delete(`/saved_query?id=eq.${id}`));

export const getConfigsByQuery = async (query) => {
  const result = await resolve(Config.get(`/query?query=${query}`));
  (result?.data?.results || []).forEach((item) => {
    item.tags = JSON.parse(item.tags);
  });
  return result;
};
