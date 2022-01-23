import { getUser } from "../auth";
import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getAllIncident = async () =>
  resolve(IncidentCommander.get(`/incident?order=created_at.desc`));

export const getIncident = async (id) =>
  resolve(
    IncidentCommander.get(
      `/incident?id=eq.${id}&select=*,hypothesis!hypothesis_incident_id_fkey(*)`
    )
  );

export const createIncident = async (params) =>
  getUser().then((user) => {
    params.created_by = user.id;
    params.commander_id = user.id;
    params.communicator_id = user.id;
    return IncidentCommander.post(`/incident?select=*`, params);
  });
