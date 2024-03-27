import { apiBase } from "../axios";
import { PlaybookResourceSelector } from "../types/playbooks";

export type SearchResourcesRequest = {
  checks?: PlaybookResourceSelector[];
  components?: PlaybookResourceSelector[];
  configs?: PlaybookResourceSelector[];
};

type SelectedResources = {
  id: string;
  icon: string; // custom icon or type of resource -> type/agent/labels/namespace
  name: string;
  type: "check" | "component" | "config";
};

export async function searchResources(input: SearchResourcesRequest) {
  const res = await apiBase.post<SelectedResources[] | null>(
    "/resources/search",
    input
  );
  return res.data ?? [];
}
