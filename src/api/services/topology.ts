import { stringify } from "qs";
import { TopologyComponentItem } from "../../components/FilterIncidents/FilterIncidentsByComponents";
import { AVATAR_INFO, TimeRangeToMinutes } from "../../constants";
import {
  CanaryChecker,
  CanaryCheckerDB,
  IncidentCommander,
  Snapshot
} from "../axios";
import { resolve } from "../resolve";
import { PaginationInfo } from "../types/common";
import { HealthCheck, HealthCheckStatus } from "../types/health";
import { Topology } from "../types/topology";
import { ComponentTeamItem } from "../types/topology";
import { ComponentTemplateItem } from "../types/topology";
import { AgentItem } from "../types/common";

interface IParam {
  id?: string;
  [key: string]: string | boolean | number | undefined;
}

const arrangeTopologyParams = (params: IParam) => {
  ["type", "team", "labels", "status", "agent_id"].forEach((param) => {
    if (params[param] === "All") {
      delete params[param];
    }
  });
  return params;
};

export const updateComponentVisibility = async (
  topologyId: string,
  hide: boolean
) => {
  return IncidentCommander.patch(`/components?id=eq.${topologyId}`, {
    hidden: hide
  });
};

export const updateComponent = async (
  topologyId: string,
  component: Omit<Partial<Topology>, "id">
) => {
  return IncidentCommander.patch(`/components?id=eq.${topologyId}`, {
    ...component
  });
};

export type GetTopologyApiResponse = {
  components?: Topology[];
  healthStatuses?: string[];
  tags?: Record<string, string[]>;
  teams?: string[];
  types?: string[];
};

export const getTopology = async (
  params: IParam
): Promise<GetTopologyApiResponse> => {
  params = arrangeTopologyParams(params);
  const query = stringify(params);
  let { data } = await CanaryChecker.get<GetTopologyApiResponse | null>(
    `/api/topology?${query}`
  );
  return (
    data ?? {
      components: [],
      healthStatuses: [],
      tags: {},
      teams: [],
      types: []
    }
  );
};

export const getTopologyWithoutUnroll = async (params: IParam) => {
  params = arrangeTopologyParams(params);
  const query = stringify(params);
  return await CanaryChecker.get<Record<"components", Topology[]> | null>(
    `/api/topology?${query}`
  ).then((results) => {
    let { data } = results;
    if (data == null) {
      console.warn("returning empty");
      return { data: [] };
    }
    return { data };
  });
};

export type CanaryGraphResponse = {
  duration: number;
  runnerName: string;
  status: CanaryGraphStatus[];
  latency: {
    rollingIn: number;
    [key: string]: number;
  };
  uptime: {
    passed: number;
    failed: number;
  };
};

export type CanaryGraphStatus = {
  time: string;
  status: boolean;
  duration: number;
};

export const getCanaryGraph = async (
  params: Record<string, string | number | boolean>
) => {
  const query = stringify(params);
  return CanaryChecker.get<CanaryGraphResponse | null>(`/api/graph?${query}`);
};

type HealthCheckAPIResponse = {
  checks: HealthCheck[];
  duration: number;
  runnerName: string;
};

export const getCanaries = async (
  params: Record<string, string | number | boolean>
) => {
  const query = stringify(params);
  return CanaryChecker.get<HealthCheckAPIResponse | null>(`/api?${query}`);
};

export const getCheckStatuses = (
  checkId: string,
  start: string,
  { pageIndex, pageSize }: PaginationInfo,
  status?: string,
  duration?: string
) => {
  const from = new Date();
  from.setMinutes(-TimeRangeToMinutes[start]);
  let queryString = `check_id=eq.${checkId}&time=gt.${from.toISOString()}&order=time.desc`;
  if (status) {
    queryString = `${queryString}&status=eq.${status}`;
  }
  if (duration) {
    queryString = `${queryString}&duration=gte.${duration}`;
  }
  queryString = `${queryString}&limit=${pageSize}&offset=${
    pageIndex * pageSize
  }`;
  return resolve(
    CanaryCheckerDB.get<HealthCheckStatus[] | null>(
      `/check_statuses?${queryString}`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getTopologyComponents = () => {
  return IncidentCommander.get<TopologyComponentItem[]>(
    `/component_names?order=name.asc`
  );
};

export const getTopologyComponentsWithLogs = () => {
  return IncidentCommander.get<TopologyComponentItem[]>(
    `/components_with_logs?order=name.asc`
  );
};

export const getAgentByID = async (id: string) => {
  const res = await IncidentCommander.get<AgentItem[] | null>(
    `/agents?select=id,name,description&id=eq.${id}`
  );
  return res.data?.[0] ?? null;
};

export const getAgentByIDs = async (ids: string[]) => {
  const res = await IncidentCommander.get<AgentItem[] | null>(
    `/agents?select=id,name,description&id=in.(${ids.join(",")})`
  );
  return res.data ?? [];
};

export const getAllAgents = () => {
  return IncidentCommander.get<AgentItem[] | null>(
    `/agents?select=id,name,description`
  );
};

export const getTopologyComponentByID = async (topologyID: string) => {
  const res = await IncidentCommander.get<TopologyComponentItem[]>(
    `/component_names?id=eq.${topologyID}`
  );
  return res.data[0];
};

export const getTopologyComponentLabels = () => {
  return IncidentCommander.get(`/component_labels`);
};

export const getTopologyComponent = (id: string) => {
  return IncidentCommander.get<TopologyComponentItem[]>(
    `/component_names?id=eq.${id}`
  );
};

export const getComponentTemplate = async (id: string) => {
  const res = await IncidentCommander.get<ComponentTemplateItem[] | null>(
    `/topologies?id=eq.${id}`
  );
  return res.data?.[0];
};

export const getHealthCheckItem = async (id: string) => {
  const res = await IncidentCommander.get<HealthCheck[] | null>(
    `/canaries?id=eq.${id}`
  );
  return res.data?.[0];
};

export const getComponentTeams = async (id: string) => {
  const res = await IncidentCommander.get<ComponentTeamItem[] | null>(
    `/team_components?component_id=eq.${id}&select=*,team:teams(*, created_by(${AVATAR_INFO}))`
  );
  return res.data || [];
};

export const getTopologySnapshot = async (
  id: string,
  {
    start,
    related
  }: {
    start?: string;
    related?: boolean;
  }
) => {
  const query = stringify({ start, related });
  const res = await Snapshot.get<Blob>(`/topology/${id}?${query}`, {
    responseType: "blob"
  });
  return res.data;
};

export type ComponentHealthCheckView = {
  component_id: string;
  id: string;
  type: string;
  name: string;
  severity: string;
  status: string;
};

export const getComponentChecks = async (id: string) => {
  const res = await IncidentCommander.get<ComponentHealthCheckView[]>(
    `/checks_by_component?component_id=eq.${id}`
  );
  return res.data;
};
