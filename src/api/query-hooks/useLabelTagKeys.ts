import { useQuery } from "@tanstack/react-query";
import {
  getConfigsTagsAndLabelsKeys,
  getChecksLabelsKeys,
  getComponentsLabelsKeys
} from "../services/tags_labels";

export function useGetAllConfigTagsAndLabelsKeys() {
  return useQuery<{ key: string }[], Error>(
    ["config_tags_labels_keys"],
    async () => {
      const response = await getConfigsTagsAndLabelsKeys();
      return response ?? [];
    }
  );
}

export function useGetAllComponentLabelsKeys() {
  return useQuery<{ key: string }[], Error>(
    ["component_labels_keys"],
    async () => {
      const response = await getComponentsLabelsKeys();
      return response ?? [];
    }
  );
}

export function useGetAllCheckLabelsKeys() {
  return useQuery<{ key: string }[], Error>(
    ["checks_labels_keys"],
    async () => {
      const response = await getChecksLabelsKeys();
      return response ?? [];
    }
  );
}
