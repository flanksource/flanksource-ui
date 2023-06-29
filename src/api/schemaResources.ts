import {
  SchemaApi,
  SchemaBackends
} from "../components/SchemaResourcePage/resourceTypes";
import { CanaryCheckerDB, ConfigDB, IncidentCommander } from "./axios";
import { AVATAR_INFO } from "../constants";
import { AxiosResponse } from "axios";
import { JobHistoryStatus } from "../components/JobsHistory/JobsHistoryTable";
import { ConfigItem } from "./services/configs";
import { TopologyComponentItem } from "../components/FilterIncidents/FilterIncidentsByComponents";
import { LogBackends } from "../components/LogBackends/LogBackends";
import { EventQueueStatus } from "../components/EventQueueStatus/eventQueue";

export interface SchemaResourceI {
  id: string;
  name: string;
  spec: {
    spec?: string;
    [key: string]: any;
  };
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
    const url = new URLSearchParams();
    url.set("select", `*,created_by(${AVATAR_INFO})`);
    url.set("deleted_at", "is.null");
    url.set("order", "created_at.desc");
    url.set("limit", "100");
    return endpoint.get<SchemaResourceWithJobStatus[]>(
      `/${tableName}?${url.toString()}`
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
  getBackend(api)?.patch(`/${table}?id=eq.${id}`, {
    deleted_at: "now()"
  });

export async function getConfigsScrapperConfigsToDelete(
  configScrapperID: string
): Promise<
  Pick<ConfigItem, "id" | "type" | "config_class" | "name">[] | undefined
> {
  const res = await CanaryCheckerDB.get<
    {
      config_items: Pick<ConfigItem, "id" | "type" | "config_class" | "name">[];
    }[]
  >(
    `config_scrapers?select=config_items(id,name,external_type,config_type)&id=eq.${configScrapperID}`
  );
  return res.data?.[0]?.config_items;
}

type TopologyComponent = TopologyComponentItem & {
  components: TopologyComponentItem[];
};

export async function getTemplatesRelatedComponents(templateID: string) {
  const res = await IncidentCommander.get<
    | {
        components: TopologyComponent[];
      }[]
    | undefined
  >(`topologies?select=id,components(id,name,type,icon)&id=eq.${templateID}`);
  return res.data?.[0]?.components;
}

export async function getLogsBackends() {
  const res = await CanaryCheckerDB.get<LogBackends[] | null>(
    `logging_backends?order=created_at.desc&select=*,created_by(${AVATAR_INFO})&deleted_at=is.null`
  );
  return res.data ?? [];
}

export async function getEventQueueStatus() {
  const res = await CanaryCheckerDB.get<EventQueueStatus[] | null>(
    `failed_push_queue?order=latest_failure.desc`
  );
  return res.data ?? [];
}
