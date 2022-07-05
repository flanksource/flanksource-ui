import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getResponder = async (ids) =>
  resolve(IncidentCommander.get(`/person?id=in.(${ids})`));

export const saveResponder = (params) =>
  resolve(IncidentCommander.post(`/responder?select=*`, params));

export const getRespondersForTheIncident = (id) =>
  resolve(IncidentCommander.get(`/responder?incident_id=eq.${id}&select=*`));

export const deleteResponder = (id) =>
  resolve(IncidentCommander.delete(`/responder?id=eq.${id}`));
