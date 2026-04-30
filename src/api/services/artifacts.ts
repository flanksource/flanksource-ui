import { SortingState } from "@tanstack/react-table";
import { Artifact, ArtifactSummary } from "../types/artifacts";
import { ArtifactAPI, IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";

export function artifactDownloadURL(artifactId: string, filename?: string) {
  const params = filename ? `?filename=${encodeURIComponent(filename)}` : "";
  return `/api/artifacts/download/${artifactId}${params}`;
}

export async function downloadArtifact(artifactId: string) {
  const response = await ArtifactAPI.get(`/download/${artifactId}`, {
    responseType: "text"
  });
  return response.data;
}

export async function fetchArtifacts({
  pageIndex = 0,
  pageSize = 50,
  sortBy,
  contentType,
  filenameSearch
}: {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: SortingState;
  contentType?: string;
  filenameSearch?: string;
}) {
  const query = new URLSearchParams({
    select:
      "*,playbook_run_action:playbook_run_actions(id,name,playbook_run_id),config_change:config_changes(id,config_id,change_type)"
  });

  query.set("limit", pageSize.toString());
  query.set("offset", (pageIndex * pageSize).toString());

  if (sortBy && sortBy.length > 0) {
    query.set("order", `${sortBy[0].id}.${sortBy[0].desc ? "desc" : "asc"}`);
  } else {
    query.set("order", "created_at.desc");
  }

  if (contentType && contentType !== "all") {
    query.set("content_type", `eq.${contentType}`);
  }

  if (filenameSearch) {
    query.set("filename", `ilike.*${filenameSearch}*`);
  }

  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<Artifact[]>(`/artifacts?${query.toString()}`, {
      headers: {
        Prefer: "count=exact"
      }
    })
  );
}

export async function fetchArtifactSummary() {
  const res = await IncidentCommander.get<ArtifactSummary[]>(
    "/artifact_summary?select=*"
  );
  return res.data ?? [];
}
