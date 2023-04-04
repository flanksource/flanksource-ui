import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { CostsData } from "../../components/CostDetails/CostDetails";
import { toastError } from "../../components/Toast/toast";
import {
  getAllChanges,
  getAllConfigsMatchingQuery,
  getConfig,
  getConfigAnalysis,
  getConfigChange,
  getConfigInsight,
  getConfigInsights,
  getConfigTagsList,
  getConfigName
} from "../services/configs";
import { getHypothesisResponse } from "../services/hypothesis";
import { getIncident } from "../services/incident";
import {
  getIncidentHistory,
  IncidentHistory
} from "../services/IncidentsHistory";
import {
  ComponentTeamItem,
  getComponentTeams,
  getHealthCheckItem,
  getTopology,
  getTopologyComponentLabels,
  getTopologyComponents
} from "../services/topology";
import { getPersons, getVersionInfo } from "../services/users";
import { getLogs } from "../services/logs";
import LogItem from "../../types/Logs";

const cache: Record<string, any> = {};

const defaultStaleTime = 1000 * 60 * 5;

export const createIncidentQueryKey = (id: string) => ["getIncident", id];

export const useVersionInfo = () => {
  return useQuery(["version-info"], getVersionInfo, {});
};

export const useIncidentQuery = (id: string) => {
  return useQuery(createIncidentQueryKey(id), () => getIncident(id), {
    staleTime: defaultStaleTime
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
  const cacheKey = `topology${topologyId}`;
  return useQuery(
    ["topology", topologyId],
    () => {
      return getTopology({
        id: topologyId
      }).then((data) => {
        cache[cacheKey] = data.data[0];
        return data.data[0];
      });
    },
    {
      staleTime,
      enabled,
      placeholderData: () => {
        return cache[cacheKey];
      },
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
    query = `${query}&or=(name.ilike.*${search}*,config_type.ilike.*${search}*,description.ilike.*${search}*,namespace.ilike.*${search}*)`;
  } else {
    const filterQueries = [];
    if (configType && configType !== "All") {
      filterQueries.push(`config_type=eq.${configType}`);
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
    const sortField = sortBy === "config_type" ? `${sortBy},name` : sortBy;
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
  const cacheKey = `config${configId}`;
  return useQuery(
    ["config", configId],
    () => {
      return getConfigName(configId).then((data) => {
        cache[cacheKey] = data?.data?.[0];
        return data?.data?.[0];
      });
    },
    {
      staleTime,
      enabled,
      placeholderData: () => {
        return cache[cacheKey];
      },
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
  pageIndex?: number,
  pageSize?: number,
  keepPreviousData?: boolean
) {
  return useQuery(
    ["configs", "changes", "all", pageIndex, pageSize],
    () => getAllChanges(pageIndex, pageSize),
    {
      keepPreviousData
    }
  );
}

export function useGetConfigChangesQueryById(id: string) {
  return useQuery(["configs", "changes", id], () => getConfigChange(id), {
    select: (res) => {
      if (res.error) {
        throw res.error;
      }
      return res?.data?.length === 0 ? [] : res?.data;
    },
    onError: (err: any) => {
      toastError(err);
    },
    enabled: !!id
  });
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

export function useGetConfigInsights<T>(configId: string) {
  return useQuery(
    ["configs", "insights", configId],
    () => getConfigInsights<T>(configId),
    {
      enabled: !!configId
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
  {
    externalId,
    type,
    query,
    start
  }: {
    externalId: string;
    type: string;
    query: string;
    start: string;
  },
  options?: UseQueryOptions<LogItem[], Error>
) {
  return useQuery<LogItem[], Error>(
    ["topology", "logs", externalId, type, query, start],
    async () => {
      const payload = {
        query,
        id: externalId,
        type,
        start
      };
      if (!externalId) {
        return Promise.resolve([]);
      }
      const res = await getLogs(payload);
      if (res.error) {
        throw res.error;
      }
      return res.data.results;
    },
    options
  );
}
