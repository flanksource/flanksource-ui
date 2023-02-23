import {
  SchemaApi,
  SchemaBackends
} from "../components/SchemaResourcePage/resourceTypes";
import { CanaryCheckerDB, ConfigDB, IncidentCommander } from "./axios";
import { AVATAR_INFO } from "../constants";
import { AxiosResponse } from "axios";

export interface SchemaResourceI {
  id: string;
  name: string;
  spec: string | object;
  namespace: string;
  labels: { [key: string]: any };
  schedule?: string;
  icon?: string;
  source: string;
  created_at: string;
  updated_at: string;
  created_by?: {
    id: string;
    avatar: string;
    name: string;
  };
}

const invalidEndpoint = (api: string): never => {
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

export const getAll = ({
  table,
  api
}: SchemaApi): Promise<AxiosResponse<SchemaResourceI[]>> => {
  const endpoint = getBackend(api);
  if (endpoint) {
    return endpoint.get<SchemaResourceI[]>(
      `/${table}?order=created_at.desc&select=*,created_by(${AVATAR_INFO})&limit=100`
    );
  }
  return Promise.resolve({ data: [] } as any);
};

export const createResource = ({ api, table }: SchemaApi, data: unknown) =>
  getBackend(api)?.post(`/${table}`, data);

export const updateResource = ({ api, table }: SchemaApi, data: unknown) =>
  getBackend(api)?.patch(`/${table}?id=eq.${data?.id}`, data);

export const getResource = ({ api, table }: SchemaApi, id: string) =>
  getBackend(api)?.get(`/${table}?id=eq.${id}`);

export const deleteResource = ({ api, table }: SchemaApi, id: string) =>
  getBackend(api)?.delete(`/${table}?id=eq.${id}`);
