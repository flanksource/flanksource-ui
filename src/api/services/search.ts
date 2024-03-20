import { apiBase } from "../axios";
import { PlaybookResourceSelector } from "../types/playbooks";

export type SearchResourcesRequest = {
  checks?: PlaybookResourceSelector[];
  components?: PlaybookResourceSelector[];
  configs?: PlaybookResourceSelector[];
};

type SelectedResources = {
  id: string;
  icon: string;
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
