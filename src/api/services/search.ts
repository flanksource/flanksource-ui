import { apiBase } from "../axios";
import { PlaybookResourceSelector } from "../types/playbooks";

export type SearchResourcesRequest = {
  checks?: PlaybookResourceSelector[];
  canaries?: PlaybookResourceSelector[];
  components?: PlaybookResourceSelector[];
  configs?: PlaybookResourceSelector[];
  connections?: PlaybookResourceSelector[];
  playbooks?: PlaybookResourceSelector[];
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
  canaries: SearchedResource[];
  components: SearchedResource[];
  connections: SearchedResource[];
  playbooks: SearchedResource[];
};

export async function searchResources(input: SearchResourcesRequest) {
  const res = await apiBase.post<SelectedResources | null>(
    "/resources/search",
    input
  );
  return res.data ?? undefined;
}
