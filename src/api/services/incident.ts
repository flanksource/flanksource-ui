import { stringify } from "qs";
import { AVATAR_INFO } from "../../constants";
import { IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import {
  Incident,
  IncidentStatus,
  IncidentSummary,
  NewIncident
} from "../types/incident";
import { User } from "../types/users";

export const searchIncident = (query: string) => {
  const hypotheses = `hypotheses(id, type)`;
  return resolvePostGrestRequestWithPagination<Incident[]>(
    IncidentCommander.get(
      `/incidents?order=created_at.desc&title=ilike.*${query}*&select=*,${hypotheses}`
    )
  );
};
export const getAllIncident = ({ limit = 10 }) => {
  const limitStr = limit ? `limit=${limit}` : "";
  const hypotheses = `hypotheses(id, type)`;
  return resolvePostGrestRequestWithPagination<Incident[]>(
    IncidentCommander.get(
      `/incidents?order=created_at.desc&${limitStr}&select=*,${hypotheses}`
    )
  );
};

export const getIncident = async (id: string) => {
  const hypotheses = `hypotheses(*,created_by(${AVATAR_INFO}),evidences(*,created_by(${AVATAR_INFO})),comments(created_at,comment,external_created_by,responder_id(team_id(*)),created_by(id,${AVATAR_INFO}),id))`;

  const res = await resolvePostGrestRequestWithPagination<Incident[] | null>(
    IncidentCommander.get(
      `/incidents?id=eq.${id}&select=*,${hypotheses},commander:commander_id(${AVATAR_INFO}),communicator_id(${AVATAR_INFO}),responders(created_by(${AVATAR_INFO}))`
    )
  );
  return res.data?.[0];
};

interface IncidentParams {
  topologyId?: string;
  configId?: string;
  type?: string;
  status?: string;
}

export const getIncidentsBy = async ({
  topologyId,
  configId,
  type,
  status
}: IncidentParams) => {
  let params: Record<string, string> = {
    order: "created_at.desc"
  };

  if (type != null && type.toLowerCase() !== "all") {
    params["type"] = `eq.${type.toLowerCase()}`;
  }
  if (status != null && status?.toLowerCase() !== "all") {
    params["status"] = `eq.${status.toLowerCase()}`;
  }

  if (topologyId) {
    params["component_id"] = `eq.${topologyId}`;
    return resolvePostGrestRequestWithPagination(
      IncidentCommander.get<Incident[] | null>(
        `incidents_by_component?${stringify(params)}`
      )
    );
  } else {
    params["config_id"] = `eq.${configId}`;
    return resolvePostGrestRequestWithPagination(
      IncidentCommander.get<Incident[] | null>(
        `incidents_by_config?${stringify(params)}`
      )
    );
  }
};

export const getIncidentsSummary = async (
  params?: Record<string, string | undefined>
) => {
  const { search = "" } = params!;
  const searchStr = search ? `&title=ilike.*${search}*` : "";
  const { search: _, ...filters } = params ?? {};
  const { data } = await resolvePostGrestRequestWithPagination<
    IncidentSummary[] | null
  >(
    IncidentCommander.get(
      `/incident_summary?${searchStr}&order=created_at.desc`,
      {
        params: filters
      }
    )
  );
  return data || [];
};

export const getIncidentsWithParams = async (
  params?: Record<string, string | undefined>
) => {
  const comments = `comments(id,created_by(${AVATAR_INFO}))`;
  const hypotheses = params?.["hypotheses.evidences.component_id"]
    ? `hypotheses!inner(*,created_by(${AVATAR_INFO}),evidences!inner(id,evidence,type,component_id))`
    : `hypotheses(*,created_by(${AVATAR_INFO}),evidences(id,evidence,type,component_id))`;

  const responder = `responders(*,team:team_id(id,name,icon,spec),person:person_id(id,name,avatar),created_by(${AVATAR_INFO}))`;
  const { search = "" } = params!;
  const searchStr = search ? `&title=ilike.*${search}*` : "";
  const { search: _, ...filters } = params!;

  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<Incident[]>(
      `/incidents?${searchStr}&select=*,${hypotheses},${comments},commander_id(${AVATAR_INFO}),communicator_id(${AVATAR_INFO}),${responder}&order=created_at.desc`,
      {
        params: filters
      }
    )
  );
};

export const updateIncident = async (
  id: string | null,
  incidents: Partial<Incident>
) => {
  if (!id) {
    console.error("No id", incidents);
    return;
  }
  IncidentCommander.patch(`/incidents?id=eq.${id}`, incidents);
};

export const createIncident = async (
  user: User,
  incidents: Omit<
    NewIncident,
    "created_by" | "commander_id" | "communicator_id"
  >
) => {
  const params = {
    ...incidents,
    type: incidents.type,
    status: incidents.status ?? IncidentStatus.Open,
    created_by: user.id,
    commander_id: user.id,
    communicator_id: user.id
  };

  const { data, error } = await resolvePostGrestRequestWithPagination<
    Incident[]
  >(IncidentCommander.post(`/incidents?select=*`, params));

  if (error) {
    return { error };
  }

  return { data: data && data[0] };
};
