import { stringify } from "qs";
import {
  CanaryChecker,
  CanaryCheckerDB,
  IncidentCommander,
  Snapshot
} from "../axios";
import { TopologyComponentItem } from "../../components/FilterIncidents/FilterIncidentsByComponents";
import { HealthCheck, HealthCheckStatus } from "../../types/healthChecks";
import { AVATAR_INFO, TimeRangeToMinutes } from "../../constants";
import { User } from "./users";
import { Topology } from "../../context/TopologyPageContext";
import { PaginationInfo } from "./configs";
import { resolve } from "../resolve";

interface IParam {
  id?: string;
  [key: string]: string | boolean | number | undefined;
}

const arrangeTopologyParams = (params: IParam) => {
  ["type", "team", "labels", "status"].forEach((param) => {
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

export const getTopology = async (
  params: IParam
): Promise<{
  data: Topology[];
}> => {
  params = arrangeTopologyParams(params);
  const query = stringify(params);
  let { data } = await CanaryChecker.get<Record<
    "components",
    Topology[]
  > | null>(`/api/topology?${query}`);

  return { data: data?.components || [] };
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

export const getCanaryGraph = async (
  params: Record<string, string | number | boolean>
) => {
  const query = stringify(params);
  return CanaryChecker.get(`/api/graph?${query}`);
};

export const getCanaries = async (
  params: Record<string, string | number | boolean>
) => {
  const query = stringify(params);
  return CanaryChecker.get(`/api?${query}`);
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
  return IncidentCommander.get<TopologyComponentItem[]>(`/component_names`);
};

export const getTopologyComponentsWithLogs = () => {
  return IncidentCommander.get<TopologyComponentItem[]>(
    `/components_with_logs?order=name.asc`
  );
};

type AgentItem = {
  id: string;
  name: string;
  description: string;
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

export type ComponentTemplateItem = {
  id: string;
  name: string;
  namespace: string;
  labels: Record<string, string>;
  spec: any;
  created_at: string;
  updated_at: string;
  schedule: string;
  deleted_at: string;
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

export type ComponentTeamItem = {
  component_id: string;
  team_id: string;
  role: string;
  selector_id: string;
  team: {
    id: string;
    name: string;
    icon: string;
    spec: any;
    source: string;
    created_by: Pick<User, "avatar" | "id" | "name">;
    created_at: string;
    updated_at: string;
  };
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
