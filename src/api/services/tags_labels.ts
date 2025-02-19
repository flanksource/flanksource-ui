import { ConfigDB } from "../axios";

export const getConfigsTagsAndLabelsKeys = async () => {
  const res = await ConfigDB.get<{ key: string }[]>("/config_tags_labels_keys");
  return res.data ?? [];
};

export const getComponentsLabelsKeys = async () => {
  const res = await ConfigDB.get<{ key: string }[]>("/component_labels_keys");
  return res.data ?? [];
};

export const getChecksLabelsKeys = async () => {
  const res = await ConfigDB.get<{ key: string }[]>("/checks_labels_keys");
  return res.data ?? [];
};
