import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getAllIncident = async () =>
  resolve(IncidentCommander.get(`/incident?order=created_at.desc&status=eq.open`));

export const getIncident = async (id) =>
  resolve(
    IncidentCommander.get(
      `/incident?id=eq.${id}&select=*,hypothesis!hypothesis_incident_id_fkey(*)`
    )
  );

export const updateIncident = async (id, incident) => {
  IncidentCommander.patch(`/incident?id=eq.${id}`, incident);
};

export const createIncident = async (user, params) => {
  params.created_by = user.id;
  params.commander_id = user.id;
  params.communicator_id = user.id;
  return IncidentCommander.post(`/incident?select=*`, params);
};
