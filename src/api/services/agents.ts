import { Agent, AgentSummary } from "../../components/Agents/AgentPage";
import { AVATAR_INFO } from "../../constants";
import { AgentAPI, IncidentCommander } from "../axios";
import { resolve } from "../resolve";

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
  return resolve(
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
