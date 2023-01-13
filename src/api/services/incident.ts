import { stringify } from "qs";
import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { Hypothesis } from "./hypothesis";
import { User } from "./users";
import { AVATAR_INFO } from "../../constants";

export enum IncidentSeverity {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Blocker = "Blocker",
  Critical = "Critical"
}

export enum IncidentStatus {
  "New" = "new",
  Open = "open",
  Investigating = "investigating",
  Mitigated = "mitigated",
  Resolved = "resolved",
  Closed = "closed"
}

export interface NewIncident {
  title: string;
  description: string;

  severity: IncidentSeverity | string;
  type?: string;
  status?: IncidentStatus;

  created_by: string;
  commander_id: {
    id?: string;
    name?: string;
    avatar?: string;
  };
  communicator_id: string;
}

export interface Incident extends NewIncident {
  id: string;
  parent_id: string;
  hypotheses: Hypothesis[];
  created_at: string;
  involved: User[];
  commander: User;
}

export const searchIncident = (query: string) => {
  const hypotheses = `hypotheses!hypotheses_incident_id_fkey(id, type)`;
  return resolve<Incident[]>(
    IncidentCommander.get(
      `/incidents?order=created_at.desc&title=ilike.*${query}*&select=*,${hypotheses}`
    )
  );
};
export const getAllIncident = ({ limit = 10 }) => {
  const limitStr = limit ? `limit=${limit}` : "";
  const hypotheses = `hypotheses!hypotheses_incident_id_fkey(id, type)`;
  return resolve<Incident[]>(
    IncidentCommander.get(
      `/incidents?order=created_at.desc&${limitStr}&select=*,${hypotheses}`
    )
  );
};

export const getIncident = async (id: string) => {
  const hypotheses = `hypotheses!hypotheses_incident_id_fkey(*,created_by(${AVATAR_INFO}),evidences(*,created_by(${AVATAR_INFO})),comments(comment,external_created_by,responder_id(team_id(*)),created_by(id,${AVATAR_INFO}),id))`;

  const res = await resolve<Incident[] | null>(
    IncidentCommander.get(
      `/incidents?id=eq.${id}&select=*,${hypotheses},commander:commander_id(${AVATAR_INFO}),communicator_id(${AVATAR_INFO}),responders!responders_incident_id_fkey(created_by(${AVATAR_INFO}))`
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
    return resolve(
      IncidentCommander.get<Incident[] | null>(
        `incidents_by_component?${stringify(params)}`
      )
    );
  } else {
    params["config_id"] = `eq.${configId}`;
    return resolve(
      IncidentCommander.get<Incident[] | null>(
        `incidents_by_config?${stringify(params)}`
      )
    );
  }
};

export const getIncidentsWithParams = async (
  params?: Record<string, string | undefined>
) => {
  const comments = `comments!comments_incident_id_fkey(id,created_by(${AVATAR_INFO}))`;
  const hypotheses = params?.["hypotheses.evidences.evidence->>id"]
    ? `hypotheses!hypotheses_incident_id_fkey!inner(*,created_by(${AVATAR_INFO}),evidences!evidences_hypothesis_id_fkey!inner(id, evidence))`
    : `hypotheses!hypotheses_incident_id_fkey(*,created_by(${AVATAR_INFO}),evidences(id,evidence,type))`;

  const responder = `responders!responders_incident_id_fkey(created_by(${AVATAR_INFO}))`;

  return resolve(
    IncidentCommander.get(
      `/incidents?&select=*,${hypotheses},${comments},commander_id(${AVATAR_INFO}),communicator_id(${AVATAR_INFO}),${responder}&order=created_at.desc`,
      {
        params
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

  const { data, error } = await resolve<Incident[]>(
    IncidentCommander.post(`/incidents?select=*`, params)
  );

  if (error) {
    return { error };
  }

  return { data: data && data[0] };
};
