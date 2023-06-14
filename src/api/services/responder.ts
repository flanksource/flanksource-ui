import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getResponder = async (ids: string[]) =>
  resolve(IncidentCommander.get(`/person?id=in.(${ids})`));

export const saveResponder = (params: Record<string, any>) =>
  resolve(IncidentCommander.post(`/responders?select=*`, params));

export const getRespondersForTheIncident = (id: string) =>
  resolve(
    IncidentCommander.get<Record<string, any>[]>(
      `/responders?incident_id=eq.${id}&select=*,team_id(id,name,icon,spec)`
    )
  );

export const deleteResponder = (id: string) =>
  resolve(IncidentCommander.delete(`/responders?id=eq.${id}`));
