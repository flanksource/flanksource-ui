import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { Hypothesis } from "./hypothesis";
import { User } from "./users";

const AVATAR_INFO = `id,name,avatar`;

export enum IncidentSeverity {
  Low = 0,
  Medium,
  High
}

export enum IncidentStatus {
  Open = "open",
  Closed = "closed"
}

export enum IncidentType {
  Issue = "issue"
}

export interface NewIncident {
  title: string;
  description: string;

  severity: IncidentSeverity;
  type?: IncidentType;
  status?: IncidentStatus;

  created_by: string;
  commander_id: string;
  communicator_id: string;
}

export interface Incident extends NewIncident {
  id: string;
  parent_id: string;
  hypothesis: Hypothesis[];
}

export const searchIncident = (query: string) => {
  const hypothesis = `hypothesis!hypothesis_incident_id_fkey(id, type)`;
  return resolve<Incident[]>(
    IncidentCommander.get(
      `/incident?order=created_at.desc&title=ilike.*${query}*&select=*,${hypothesis}`
    )
  );
};
export const getAllIncident = ({ limit = 10 }) => {
  const limitStr = limit ? `limit=${limit}` : "";
  const hypothesis = `hypothesis!hypothesis_incident_id_fkey(id, type)`;
  return resolve<Incident[]>(
    IncidentCommander.get(
      `/incident?order=created_at.desc&${limitStr}&select=*,${hypothesis}`
    )
  );
};
export const getIncident = async (id: string) => {
  const hypothesis = `hypothesis!hypothesis_incident_id_fkey(*,created_by(${AVATAR_INFO}),evidence(id,evidence,type),comment(comment,created_by(id,${AVATAR_INFO}),id))`;

  return resolve<Incident[]>(
    IncidentCommander.get(
      `/incident?id=eq.${id}&select=*,${hypothesis},commander_id(${AVATAR_INFO}),communicator_id(${AVATAR_INFO}),responder!responder_incident_id_fkey(created_by(${AVATAR_INFO}))`
    )
  );
};

export const getIncidentsWithParams = async (params) => {
  const comments = `comment!comment_incident_id_fkey(id,created_by(${AVATAR_INFO}))`;
  const hypothesis = `hypothesis!hypothesis_incident_id_fkey(*,created_by(${AVATAR_INFO}))`;
  const responder = `responder!responder_incident_id_fkey(created_by(${AVATAR_INFO}))`;

  return resolve(
    IncidentCommander.get(
      `/incident?&select=*,${hypothesis},${comments},commander_id(${AVATAR_INFO}),communicator_id(${AVATAR_INFO}),${responder}&order=created_at.desc`,
      {
        params
      }
    )
  );
};

export const updateIncident = async (
  id: string | null,
  incident: Partial<Incident>
) => {
  if (!id) {
    console.error("No id", incident);
    return;
  }
  IncidentCommander.patch(`/incident?id=eq.${id}`, incident);
};

export const createIncident = async (
  user: User,
  incident: Omit<NewIncident, "created_by" | "commander_id" | "communicator_id">
) => {
  const params = {
    ...incident,
    type: incident.type ?? IncidentType.Issue,
    status: incident.status ?? IncidentStatus.Open,
    created_by: user.id,
    commander_id: user.id,
    communicator_id: user.id
  };

  const { data, error } = await resolve<Incident[]>(
    IncidentCommander.post(`/incident?select=*`, params)
  );

  if (error) {
    return { error };
  }

  return { data: data && data[0] };
};
