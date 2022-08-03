import {
  SchemaApi,
  SchemaBackends
} from "src/components/SchemaResourcePage/resourceTypes";
import { CanaryCheckerDB, ConfigDB, IncidentCommander } from "./axios";

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
    return endpoint.get(`/${table}?order=created_at.desc`);
  }

  return Promise.resolve({ data: [] });
};

export const createResource = ({ api, table }: SchemaApi, data: unknown) =>
  getBackend(api)?.post(`/${table}`, data);

export const getResource = ({ api, table }: SchemaApi, id: string) =>
  getBackend(api)?.get(`/${table}?id=eq.${id}`);
