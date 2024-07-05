import { apiBase } from "../axios";
import { PlaybookResourceSelector } from "../types/playbooks";

export type SearchResourcesRequest = {
  checks?: PlaybookResourceSelector[];
  components?: PlaybookResourceSelector[];
  configs?: PlaybookResourceSelector[];
};

type SearchedResource = {
  id: string;
  name: string;
  type: string;
  namespace: string;
  agent: string;
  labels: Record<string, string>;
  icon?: string;
  tags?: Record<string, string>;
};

type SelectedResources = {
  configs: SearchedResource[];
  checks: SearchedResource[];
  components: SearchedResource[];
};

export async function searchResources(input: SearchResourcesRequest) {
  const res = await apiBase.post<SelectedResources | null>(
    "/resources/search",
    input
  );
  return res.data ?? undefined;
}
