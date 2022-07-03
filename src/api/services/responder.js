import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getResponder = async (ids) =>
  resolve(IncidentCommander.get(`/person?id=in.(${ids})`));

export const saveResponder = (params) =>
  resolve(IncidentCommander.post(`/responder?select=*`, params));
