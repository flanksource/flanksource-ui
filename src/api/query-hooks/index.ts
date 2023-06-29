import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { CostsData } from "../../components/CostDetails/CostDetails";
import { toastError } from "../../components/Toast/toast";
import {
  getAllChanges,
  getAllConfigsMatchingQuery,
  getConfig,
  getConfigAnalysis,
  getConfigChanges,
  getConfigInsight,
  getConfigInsights,
  getConfigTagsList,
  getConfigName,
  getTopologyRelatedInsights
} from "../services/configs";
import { getHypothesisResponse } from "../services/hypothesis";
import { getIncident } from "../services/incident";
import {
  getIncidentHistory,
  IncidentHistory
} from "../services/IncidentsHistory";
import {
  ComponentTeamItem,
  getAllAgents,
  getComponentTeams,
  getHealthCheckItem,
  getTopology,
  getTopologyComponentLabels,
  getTopologyComponents,
  getTopologyComponentsWithLogs
} from "../services/topology";
import { getPersons, getVersionInfo } from "../services/users";
import { LogsResponse, searchLogs, SearchLogsPayload } from "../services/logs";

const defaultStaleTime = 1000 * 60 * 5;

export const createIncidentQueryKey = (id: string) => ["getIncident", id];

export const useVersionInfo = () => {
  return useQuery(["version-info"], getVersionInfo, {});
};

export const useIncidentQuery = (id: string) => {
  return useQuery(createIncidentQueryKey(id), () => getIncident(id), {
    enabled: !!id
  });
};

export const useComponentsQuery = ({
  enabled = true,
  staleTime = defaultStaleTime,
  ...rest
}) => {
  return useQuery(
    ["allcomponents"],
    async () => {
      const res = await getTopologyComponents();
      return res.data;
    },
    {
      staleTime,
      enabled,
      ...rest
    }
  );
};

export const useAllAgentNamesQuery = ({
  enabled = true,
  staleTime = defaultStaleTime,
  ...rest
}) => {
  return useQuery(
    ["allagents"],
    async () => {
      const res = await getAllAgents();
      return res.data;
    },
    {
      staleTime,
      enabled,
      ...rest
    }
  );
};

export const useComponentsWithLogsQuery = ({
  enabled = true,
  staleTime = defaultStaleTime,
  ...rest
}) => {
  return useQuery(
    ["components_with_logs", "logs"],
    async () => {
      const res = await getTopologyComponentsWithLogs();
      return res.data;
    },
    {
      staleTime,
      enabled,
      ...rest
    }
  );
};

export const useComponentLabelsQuery = ({
  enabled = true,
  staleTime = defaultStaleTime,
  ...rest
}) => {
  return useQuery(["alllabels"], getTopologyComponentLabels, {
    staleTime,
    enabled,
    ...rest
  });
};

export const useComponentNameQuery = (
  topologyId = "",
  { enabled = true, staleTime = defaultStaleTime, ...rest }
) => {
  return useQuery(
    ["topology", topologyId],
    () => {
      return getTopology({
        id: topologyId
      }).then((data) => {
        return data.components?.[0];
      });
    },
    {
      staleTime,
      enabled,
      ...rest
    }
  );
};

type ConfigListFilterQueryOptions = {
  search?: string | null;
  configType?: string | null;
  tag?: string | null;
  hideDeletedConfigs?: boolean;
  sortBy?: string | null;
  sortOrder?: string | null;
};

function prepareConfigListQuery({
  search,
  configType,
  tag,
  sortBy,
  sortOrder,
  hideDeletedConfigs
}: ConfigListFilterQueryOptions) {
  let query = "select=*";
  if (search) {
    query = `${query}&or=(name.ilike.*${search}*,type.ilike.*${search}*,description.ilike.*${search}*,namespace.ilike.*${search}*)`;
  } else {
    const filterQueries = [];
    if (configType && configType !== "All") {
      filterQueries.push(`type=eq.${configType}`);
    }
    if (tag && tag !== "All") {
      const [k, v] = decodeURI(tag).split("__:__");
      filterQueries.push(`tags->>${k}=eq.${encodeURIComponent(v)}`);
    }
    if (filterQueries.length) {
      query = `${query}&${filterQueries.join("&")}`;
    }
  }
  if (sortBy && sortOrder) {
    const sortField = sortBy === "type" ? `${sortBy},name` : sortBy;
    query = `${query}&order=${sortField}.${sortOrder}`;
  }
  if (hideDeletedConfigs) {
    query = `${query}&deleted_at=is.null`;
  }
  return query;
}

export const useAllConfigsQuery = (
  {
    search,
    tag,
    configType,
    sortBy,
    sortOrder,
    hideDeletedConfigs
  }: ConfigListFilterQueryOptions,
  { enabled = true, staleTime = defaultStaleTime, ...rest }
) => {
  const query = prepareConfigListQuery({
    search,
    tag,
    configType,
    sortBy,
    sortOrder,
    hideDeletedConfigs
  });
  return useQuery(
    [
      "allConfigs",
      search,
      tag,
      configType,
      sortBy,
      sortOrder,
      hideDeletedConfigs
    ],
    () => {
      return getAllConfigsMatchingQuery(query);
    },
    {
      staleTime,
      enabled,
      ...rest
    }
  );
};

export const useConfigNameQuery = (
  configId = "",
  { enabled = true, staleTime = defaultStaleTime, ...rest }
) => {
  return useQuery(
    ["config", configId],
    () => {
      return getConfigName(configId).then((data) => {
        return data?.data?.[0];
      });
    },
    {
      staleTime,
      enabled,
      ...rest
    }
  );
};

export const useGetPeopleQuery = ({
  enabled = true,
  staleTime = defaultStaleTime,
  ...rest
}) => {
  return useQuery(
    ["people"],
    () => {
      return getPersons().then(({ data }) => {
        const users = data?.map((user) => ({
          ...user,
          display: user.name
        }));
        return users || [];
      });
    },
    {
      staleTime,
      enabled,
      ...rest
    }
  );
};

export const useCanaryCheckItemQuery = (
  canaryID: string,
  /* todo: think of a better way to formulate types for the query options */
  { enabled = true, ...rest }
) => {
  return useQuery(
    ["db", "canaries", canaryID],
    () => getHealthCheckItem(canaryID),
    {
      enabled,
      ...rest
    }
  );
};

export const useGetHypothesisQuery = (
  hypothesisId = "",
  { enabled = true, staleTime = defaultStaleTime, ...rest }
) => {
  return useQuery(
    ["hypothesis", hypothesisId],
    () => getHypothesisResponse(hypothesisId),
    {
      enabled,
      ...rest
    }
  );
};

export function useGetAllConfigsChangesQuery(
  {
    severity,
    type,
    change_type
  }: {
    severity?: string;
    type?: string;
    change_type?: string;
  },
  pageIndex?: number,
  pageSize?: number,
  keepPreviousData?: boolean
) {
  return useQuery(
    [
      "configs",
      "changes",
      "all",
      severity,
      type,
      change_type,
      pageIndex,
      pageSize
    ],
    () => getAllChanges({ change_type, severity, type }, pageIndex, pageSize),
    {
      keepPreviousData
    }
  );
}

export function useGetConfigChangesByConfigIdQuery(
  id: string,
  pageIndex?: number,
  pageSize?: number,
  keepPreviousData?: boolean
) {
  return useQuery(
    ["configs", "changes", id, pageIndex, pageSize],
    () => getConfigChanges(id, pageIndex, pageSize),
    {
      enabled: !!id && !!pageSize,
      keepPreviousData
    }
  );
}

export function useGetConfigByIdQuery(id: string) {
  return useQuery(
    ["configs", id],
    async () => {
      const { error, data } = await getConfig(id!);
      if (error) {
        throw error;
      }
      return data?.[0];
    },
    {
      onError: (err: any) => toastError(err),
      enabled: !!id
    }
  );
}

export function useGetConfigTagsListQuery() {
  return useQuery(["configs", "tags", "list"], async () => {
    const { error, data } = await getConfigTagsList();
    if (error) {
      throw error;
    }
    return data ?? [];
  });
}

export function useGetComponentsTeamQuery(
  componentId: string,
  options?: UseQueryOptions<ComponentTeamItem[]>
) {
  return useQuery<ComponentTeamItem[]>(
    ["components", "teams", componentId],
    async () => {
      const data = await getComponentTeams(componentId);
      return data;
    },
    {
      ...options
    }
  );
}

export function useGetConfigInsights<T>(
  configId: string,
  pageIndex?: number,
  pageSize?: number,
  keepPreviousData?: boolean
) {
  return useQuery(
    ["configs", "insights", configId, pageIndex, pageSize],
    () => getConfigInsights<T>(configId, pageIndex, pageSize),
    {
      enabled: !!configId,
      keepPreviousData
    }
  );
}

export function useGetConfigInsight<T>(
  configId: string,
  configInsightId: string
) {
  return useQuery(
    ["configs", "insights", configId, configInsightId],
    () => getConfigInsight<T>(configId, configInsightId),
    {
      enabled: !!configId && !!configInsightId
    }
  );
}

export function useIncidentsHistoryQuery(
  incidentId: string,
  options?: UseQueryOptions<IncidentHistory[], Error>
) {
  return useQuery<IncidentHistory[], Error>(
    ["incident_histories", incidentId],
    () => getIncidentHistory(incidentId),
    options
  );
}

export function useConfigAnalysisQuery(
  configId: string,
  options?: UseQueryOptions<CostsData[], Error>
) {
  return useQuery<CostsData[], Error>(
    ["config_analysis", configId],
    () => getConfigAnalysis(configId),
    options
  );
}

export function useComponentGetLogsQuery(
  { query, id, name }: SearchLogsPayload,
  options?: UseQueryOptions<LogsResponse, Error>
) {
  return useQuery<LogsResponse, Error>(
    ["topology", "logs", id, name, query],
    async () => searchLogs({ id, name, query }),
    options
  );
}

export function useGetTopologyRelatedInsightsQuery(id: string) {
  return useQuery(
    ["topology", "insights", id],
    async () => {
      const res = await getTopologyRelatedInsights(id);
      // ensure analysis has all the fields
      return res.map((item) => ({
        ...((item.config?.analysis?.length ?? 0) > 0
          ? item.config?.analysis?.[0]
          : {}),
        ...item
      }));
    },
    {}
  );
}
