// http://incident-commander.canary.lab.flanksource.com/config/db

import { ConfigDB } from "../axios";
import { resolve } from "../resolve";

export const getAllConfigs = async () => resolve(ConfigDB.get(`/config_item`));

export const getAllChanges = async () =>
  resolve(ConfigDB.get(`/config_change`));

export const getConfig = async (id) =>
  resolve(ConfigDB.get(`/config_item?id=eq.${id}`));

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
