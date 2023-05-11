import {
  SchemaApi,
  SchemaBackends
} from "../components/SchemaResourcePage/resourceTypes";
import { CanaryCheckerDB, ConfigDB, IncidentCommander } from "./axios";
import { AVATAR_INFO } from "../constants";
import { AxiosResponse } from "axios";
import { JobHistoryStatus } from "../components/JobsHistory/JobsHistoryTable";

export interface SchemaResourceI {
  id: string;
  name: string;
  spec: { spec: string | undefined } & Record<string, any>;
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

export interface SchemaResourceWithJobStatus extends SchemaResourceI {
  job_created_at?: string;
  job_details?: { errors: any[] };
  job_duration_millis?: number;
  job_error_count?: number;
  job_hostname?: string;
  job_name?: string;
  job_resource_type?: string;
  job_status?: JobHistoryStatus;
  job_success_count?: number;
  job_time_end?: string;
  job_time_start?: string;
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

const getTableName = (table: string) => {
  switch (table) {
    case "incident_rules":
    case "connections":
      return table;
    default:
      return `${table}_with_status`;
  }
};

export const getAll = ({
  table,
  api
}: SchemaApi): Promise<AxiosResponse<SchemaResourceWithJobStatus[]>> => {
  const endpoint = getBackend(api);
  if (endpoint) {
    const tableName = getTableName(table);
    return endpoint.get<SchemaResourceWithJobStatus[]>(
      `/${tableName}?order=created_at.desc&select=*,created_by(${AVATAR_INFO})&limit=100`
    );
  }
  return Promise.resolve({ data: [] } as any);
};

export const createResource = ({ api, table }: SchemaApi, data: unknown) =>
  getBackend(api)?.post(`/${table}`, data);

export const updateResource = (
  { api, table }: SchemaApi,
  data: Record<string, any>
) => getBackend(api)?.patch(`/${table}?id=eq.${data?.id}`, data);

export const getResource = ({ api, table }: SchemaApi, id: string) =>
  getBackend(api)?.get<Record<string, any>[]>(`/${table}?id=eq.${id}`);

export const deleteResource = ({ api, table }: SchemaApi, id: string) =>
  getBackend(api)?.delete(`/${table}?id=eq.${id}`);
