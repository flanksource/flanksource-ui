// http://incident-commander.canary.lab.flanksource.com/config/db

import { Config, ConfigDB } from "../axios";
import { resolve } from "../resolve";

// Config Items

export const getAllConfigs = () => resolve(ConfigDB.get(`/config_item`));

export const getAllChanges = () =>
  resolve(ConfigDB.get(`/config_change?order=created_at.desc`));

export const getConfig = (id) =>
  resolve(ConfigDB.get(`/config_item?id=eq.${id}`));

export const getConfigChange = (id) =>
  resolve(
    ConfigDB.get(`/config_change?config_id=eq.${id}&order=created_at.desc`)
  );

export const createConfigItem = (type, params) =>
  resolve(
    ConfigDB.post(`/config_item`, {
      config_type: type,
      ...params
    })
  );

export const updateConfigItem = (id, params) =>
  resolve(ConfigDB.patch(`/config_item?id=eq.${id}`, { ...params }));

export const deleteConfigItem = (id) =>
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

export const getConfigsByQuery = (query) =>
  resolve(Config.get(`/query?query=${query}`));
