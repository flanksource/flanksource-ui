import {
  SchemaApi,
  SchemaBackends
} from "src/components/SchemaResourcePage/resourceTypes";
import { CanaryCheckerDB, ConfigDB, IncidentCommander } from "./axios";

export interface SchemaResourceI {
  id: string;
  name: string;
  spec: string;
  source: string;
  created_at: string;
  updated_at: string;
  created_by: {
    id: string;
    avatar: string;
    name: string;
  };
}

const invalidEndpoint = (api: never) => {
  throw Error(`Invalid api endpoint: ${api}`);
};

const getBackend = (api: SchemaBackends) => {
  switch (api) {
    case "incident-commander":
      return IncidentCommander;
    case "config-db":
      return ConfigDB;
    case "canary-checker":
      return CanaryCheckerDB;
    default:
      invalidEndpoint(api);
  }
};

export const getAll = ({ table, api }: SchemaApi) => {
  const endpoint = getBackend(api);
  if (endpoint) {
    return endpoint.get<SchemaResourceI[]>(
      `/${table}?order=created_at.desc&select=*,created_by(id,name,avatar)`
    );
  }

  return Promise.resolve({ data: [] });
};

export const createResource = ({ api, table }: SchemaApi, data: unknown) =>
  getBackend(api)?.post(`/${table}`, data);

export const updateResource = ({ api, table }: SchemaApi, data: unknown) =>
  getBackend(api)?.patch(`/${table}?id=eq.${data?.id}`, data);

export const getResource = ({ api, table }: SchemaApi, id: string) =>
  getBackend(api)?.get(`/${table}?id=eq.${id}`);

export const deleteResource = ({ api, table }: SchemaApi, id: string) =>
  getBackend(api)?.delete(`/${table}?id=eq.${id}`);
