import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { User } from "./users";

const AVATAR_INFO = `id,name,avatar`;

export const getAllIncident = async () =>
  resolve(IncidentCommander.get(`/incident?order=created_at.desc`));

export const getIncident = async (id: string) => {
  const hypothesis = `hypothesis!hypothesis_incident_id_fkey(*,created_by(${AVATAR_INFO}),evidence(id,evidence,type),comment(comment,created_by(id,${AVATAR_INFO}),id))`;

  return resolve(
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

export const updateIncident = async (id: string, incident) => {
  IncidentCommander.patch(`/incident?id=eq.${id}`, incident);
};

export const createIncident = async (user: User, params) => {
  params.created_by = user.id;
  params.commander_id = user.id;
  params.communicator_id = user.id;
  return IncidentCommander.post(`/incident?select=*`, params);
};
