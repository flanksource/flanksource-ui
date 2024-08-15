import { EventQueueSummary } from "@flanksource-ui/components/EventQueueStatus/eventQueue";
import { TopologyComponentItem } from "@flanksource-ui/components/Incidents/FilterIncidents/FilterIncidentsByComponents";
import {
  JobHistory,
  JobHistoryStatus
} from "@flanksource-ui/components/JobsHistory/JobsHistoryTable";
import { LogBackends } from "@flanksource-ui/components/Logs/LogBackends/LogBackends";
import {
  SchemaApi,
  SchemaBackends
} from "@flanksource-ui/components/SchemaResourcePage/resourceTypes";
import { AxiosResponse } from "axios";
import { AVATAR_INFO } from "../constants";
import { CanaryCheckerDB, ConfigDB, IncidentCommander } from "./axios";
import { resolvePostGrestRequestWithPagination } from "./resolve";
import { ConfigItem } from "./types/configs";

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
  agent_id?: string;
  created_by?: {
    id: string;
    avatar: string;
    name: string;
  };
  integration_type: "scrapers" | "topologies" | "logging_backends";
  agent?: {
    id: string;
    name: string;
  };
}

export interface SchemaResourceWithJobStatus extends SchemaResourceI {
  job_created_at?: string;
  job_details?: JobHistory["details"];
  job_duration_millis?: number;
  job_error_count?: number;
  job_hostname?: string;
  job_name?: string;
  job_resource_type?: string;
  job_status?: JobHistoryStatus;
  job_success_count?: number;
  job_time_end?: string;
  job_time_start?: string;
  last_runtime?: string;
  job_last_failed?: string;
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
    url.set(
      "select",
      `*,created_by(${AVATAR_INFO})${
        // we only need agent info for topologies, as for the time being
        table === "topologies" ? `,agent:agent_id(id,name,description)` : ""
      }`
    );
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

export const getResource = (
  { api, table }: Omit<SchemaApi, "name">,
  id: string
) => getBackend(api)?.get<SchemaResourceI[]>(`/${table}?id=eq.${id}`);

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
    `logging_backends?order=created_at.desc&select=id,spec,name,source,created_at,updated_at,created_by(${AVATAR_INFO})&deleted_at=is.null`
  );
  return res.data ?? [];
}

export async function getEventQueueStatus() {
  const res = await CanaryCheckerDB.get<EventQueueSummary[] | null>(
    `event_queue_summary?order=last_failure.desc`
  );
  return res.data ?? [];
}

export async function getIntegrationsWithJobStatus(
  pageIndex: number,
  pageSize: number
) {
  const pagingParams = `&limit=${pageSize}&offset=${pageIndex * pageSize}`;

  const res = await resolvePostGrestRequestWithPagination(
    CanaryCheckerDB.get<SchemaResourceWithJobStatus[] | null>(
      // todo: add back created_by
      `integrations_with_status?order=created_at.desc&select=*&deleted_at=is.null${pagingParams}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
  return res;
}

export async function getIntegrationWithJobStatus(id: string) {
  const res = await CanaryCheckerDB.get<SchemaResourceWithJobStatus[] | null>(
    `integrations_with_status?order=created_at.desc&select=*&deleted_at=is.null&id=eq.${id}`
  );
  return res.data?.[0];
}
