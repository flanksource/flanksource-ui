import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getResponder = async (ids) =>
  resolve(IncidentCommander.get(`/person?id=in.(${ids})`));

export const saveResponder = (params) =>
  resolve(IncidentCommander.post(`/responders?select=*`, params));

export const getRespondersForTheIncident = (id) =>
  resolve(IncidentCommander.get(`/responders?incident_id=eq.${id}&select=*`));

export const deleteResponder = (id) =>
  resolve(IncidentCommander.delete(`/responders?id=eq.${id}`));
