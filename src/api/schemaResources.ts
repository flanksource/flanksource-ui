import { IncidentCommander } from "./axios";

export const getAll = (resourceType: string) =>
  IncidentCommander.get(`/${resourceType}?order=created_at.desc`);

export const createResource = (resourceType: string, data: unknown) =>
  IncidentCommander.post(`/${resourceType}`, data);

export const get = (resourceType: string, id: string) =>
  IncidentCommander.get(`/${resourceType}?id=eq.${id}`);
