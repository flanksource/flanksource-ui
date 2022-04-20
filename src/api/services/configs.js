// http://incident-commander.canary.lab.flanksource.com/config/db

import { ConfigDB } from "../axios";
import { resolve } from "../resolve";

// Config Items

export const getAllConfigs = async () => resolve(ConfigDB.get(`/config_item`));

export const getAllChanges = async () =>
  resolve(ConfigDB.get(`/config_change?order=created_at.desc`));

export const getConfig = async (id) =>
  resolve(ConfigDB.get(`/config_item?id=eq.${id}`));

export const getConfigChange = async (id) =>
  resolve(
    ConfigDB.get(`/config_change?config_id=eq.${id}&order=created_at.desc`)
  );

export const createConfigItem = async (type, params) =>
  resolve(
    ConfigDB.post(`/config_item`, {
      config_type: type,
      ...params
    })
  );

export const updateConfigItem = async (id, params) =>
  resolve(ConfigDB.patch(`/config_item?id=eq.${id}`, { ...params }));

export const deleteConfigItem = async (id) =>
  resolve(ConfigDB.delete(`/config_item?id=eq.${id}`));

// Saved Queries

export const getAllSavedQueries = async () =>
  resolve(ConfigDB.get(`/saved_query`));

export const getSavedQuery = async (id) =>
  resolve(ConfigDB.get(`/saved_query?id=eq.${id}`));

export const createSavedQuery = async (query, params) =>
  resolve(
    ConfigDB.post(`/saved_query`, {
      query,
      ...params
    })
  );

export const updateSavedQuery = async (id, params) =>
  resolve(ConfigDB.patch(`/saved_query?id=eq.${id}`, { ...params }));

export const deleteSavedQuery = async (id) =>
  resolve(ConfigDB.delete(`/saved_query?id=eq.${id}`));
