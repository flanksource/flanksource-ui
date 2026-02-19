import { apiBase } from "../axios";
import { PlaybookResourceSelector } from "../types/playbooks";

export type SearchResourcesRequest = {
  limit?: number;
  checks?: PlaybookResourceSelector[];
  canaries?: PlaybookResourceSelector[];
  components?: PlaybookResourceSelector[];
  /**
   * `tagSelector` / tag-based search terms (e.g. `tags.cluster=...`) are only
   * supported for configs.
   */
  configs?: PlaybookResourceSelector[];
  /**
   * NOTE: catalog_changes does not support filtering by `agent`.
   * Keep selectors here limited to fields supported by that table.
   */
  config_changes?: PlaybookResourceSelector[];
  connections?: PlaybookResourceSelector[];
  /**
   * NOTE: playbooks search does not support filtering by `type`.
   */
  playbooks?: PlaybookResourceSelector[];
};

export type SearchedResource = {
  id: string;
  name: string;
  type: string;
  namespace: string;
  agent: string;
  labels: Record<string, string>;
  icon?: string;
  tags?: Record<string, string>;
  summary?: string;
  change_type?: string;
  config_id?: string;
};

export type SelectedResources = {
  configs: SearchedResource[];
  checks: SearchedResource[];
  canaries: SearchedResource[];
  components: SearchedResource[];
  config_changes: SearchedResource[];
  connections: SearchedResource[];
  playbooks: SearchedResource[];
};

export async function searchResources(input: SearchResourcesRequest) {
  const res = await apiBase.post<SelectedResources | null>(
    "/resources/search",
    input
  );
  return res.data ?? null;
}
