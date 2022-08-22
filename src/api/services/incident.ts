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

export interface NewIncident {
  title: string;
  description: string;

  severity: IncidentSeverity;
  type?: string;
  status?: IncidentStatus;

  created_by: string;
  commander_id: string;
  communicator_id: string;
}

export interface Incident extends NewIncident {
  id: string;
  parent_id: string;
  hypotheses: Hypothesis[];
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
  const hypotheses = `hypotheses!hypotheses_incident_id_fkey(*,created_by(${AVATAR_INFO}),evidences(id,evidence,type),comments(comment,created_by(id,${AVATAR_INFO}),id))`;

  return resolve<Incident[]>(
    IncidentCommander.get(
      `/incidents?id=eq.${id}&select=*,${hypotheses},commander_id(${AVATAR_INFO}),communicator_id(${AVATAR_INFO}),responders!responders_incident_id_fkey(created_by(${AVATAR_INFO}))`
    )
  );
};

export const getIncidentsWithParams = async (params) => {
  const comments = `comments!comments_incident_id_fkey(id,created_by(${AVATAR_INFO}))`;
  const hypotheses = `hypotheses!hypotheses_incident_id_fkey(*,created_by(${AVATAR_INFO}))`;
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
