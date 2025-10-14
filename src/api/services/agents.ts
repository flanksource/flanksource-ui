import { Agent, AgentSummary } from "../../components/Agents/AgentPage";
import { AVATAR_INFO } from "../../constants";
import { AgentAPI, IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import { AgentItem } from "../types/common";

export const Local = "00000000-0000-0000-0000-000000000000";

export const getAgentsList = async (
  params: {
    sortBy?: string;
    sortOrder?: string;
  },
  pagingParams: { pageIndex?: number; pageSize?: number }
) => {
  const { sortBy, sortOrder } = params;

  const sortByParam = sortBy ? `&order=${sortBy}` : "&order=created_at";
  const sortOrderParam = sortOrder ? `.${sortOrder}` : ".desc";

  const { pageIndex, pageSize } = pagingParams;
  const pagingParamsStr =
    pageIndex || pageSize
      ? `&limit=${pageSize}&offset=${pageIndex! * pageSize!}`
      : "";
  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<AgentSummary[] | null>(
      `/agents_summary?select=*,created_by(${AVATAR_INFO})&order=created_at.desc&${pagingParamsStr}${sortByParam}${sortOrderParam}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getAgentsSummaryByID = async (id: string) => {
  const res = await IncidentCommander.get<AgentSummary[] | null>(
    `/agents_summary?select=*&id=eq.${id}`
  );
  return res.data?.[0] ?? undefined;
};

export type GenerateAgent = {
  name: string;
  properties: Record<string, string>;
};

export type GeneratedAgent = {
  id: string;
  username: string;
  access_token: string;
};

export async function addAgent(agent: GenerateAgent) {
  const res = await AgentAPI.post<GeneratedAgent>("/generate", agent);
  return res.data;
}

export async function updateAgent(
  agent: GenerateAgent & {
    id: string;
  }
) {
  const res = await IncidentCommander.patch<Agent>(
    `/agents?id=eq.${agent.id}`,
    {
      properties: agent.properties
    }
  );
  return res.data;
}

export async function deleteAgent(id: string, cleanup: boolean = false) {
  const res = await IncidentCommander.patch<Agent>(`/agents?id=eq.${id}`, {
    deleted_at: "now()",
    ...(cleanup && { cleanup: true })
  });
  return res.data;
}

export const getAgentByID = async (id: string) => {
  if (id === Local) {
    return null;
  }
  const res = await IncidentCommander.get<AgentItem[] | null>(
    `/agents?select=id,name,description&id=eq.${id}`
  );
  return res.data?.[0] ?? null;
};

export const getAgentByIDs = async (ids: string[]) => {
  const res = await IncidentCommander.get<AgentItem[] | null>(
    `/agents?select=id,name,description&id=in.(${ids.join(",")})`
  );
  return res.data ?? [];
};

export const getAllAgents = () => {
  return IncidentCommander.get<AgentItem[] | null>(
    `/agents?select=id,name,description&deleted_at=is.null`
  );
};
