import { tristateOutputToQueryFilterParam } from "@flanksource-ui/ui/Dropdowns/TristateReactSelect";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { isNull } from "lodash";
import { CostsData } from "../../api/types/common";
import { toastError } from "../../components/Toast/toast";
import { getIncidentHistory } from "../services/IncidentsHistory";
import { getAllAgents } from "../services/agents";
import {
  ConfigsTagList,
  getConfig,
  getConfigAnalysis,
  getConfigChanges,
  getConfigInsight,
  getConfigInsights,
  getConfigLabelsList,
  getConfigName,
  getConfigTagsList,
  getTopologyRelatedInsights
} from "../services/configs";
import { getHypothesisResponse } from "../services/hypothesis";
import { getIncident } from "../services/incident";
import { LogsResponse, SearchLogsPayload, searchLogs } from "../services/logs";
import {
  getComponentTeams,
  getHealthCheckSpecByID,
  getTopologyByID,
  getTopologyComponentLabels,
  getTopologyComponentsByTypes,
  getTopologyComponentsWithLogs,
  getTopologyNameByID
} from "../services/topology";
import { getPersons, getVersionInfo } from "../services/users";
import { IncidentHistory } from "../types/incident";
import { ComponentTeamItem } from "../types/topology";

export const defaultStaleTime = 1000 * 60 * 5;

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
  types
}: {
  enabled?: boolean;
  types?: string[];
}) => {
  return useQuery(
    ["components", "names", types],
    async () => {
      const res = await getTopologyComponentsByTypes(types ?? []);
      return res.data;
    },
    {
      enabled
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

export const useTopologyQuery = (topologyId = "", { ...rest } = {}) => {
  return useQuery(
    ["topology", topologyId],
    () => {
      return getTopologyByID(topologyId).then((data) => {
        return data.data.length > 0 ? data.data[0] : null;
      });
    },
    {
      ...rest
    }
  );
};

export const useComponentNameQuery = (
  topologyId = "",
  { enabled = true, staleTime = defaultStaleTime, ...rest } = {}
) => {
  return useQuery(
    ["topology", topologyId],
    () => {
      return getTopologyNameByID(topologyId).then((data) => {
        return data.data.length > 0 ? data.data[0] : null;
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
  label?: string | null;
  hideDeletedConfigs?: boolean;
  sortBy?: string | null;
  sortOrder?: string | null;
  includeAgents?: boolean;
  labels?: string;
  health?: string;
  status?: string;
};

export function prepareConfigListQuery({
  search,
  configType,
  label,
  sortBy,
  sortOrder,
  hideDeletedConfigs,
  includeAgents = false,
  labels,
  health,
  status
}: ConfigListFilterQueryOptions) {
  let query =
    "select=id,type,config_class,status,health,labels,name,tags,created_at,updated_at,deleted_at,cost_per_minute,cost_total_1d,cost_total_7d,cost_total_30d,changes,analysis";
  if (includeAgents) {
    query = `${query},agent:agents(id,name)`;
  }
  if (configType && configType !== "All") {
    query = `${query}&type=eq.${configType}`;
  }
  if (status && status !== "All") {
    const statusParam = tristateOutputToQueryFilterParam(status, "status");
    query = `${query}${statusParam}`;
  }
  if (health) {
    const healthParam = tristateOutputToQueryFilterParam(health, "health");
    query = `${query}${healthParam}`;
  }
  if (search) {
    query = `${query}&or=(name.ilike.*${search}*,type.ilike.*${search}*,description.ilike.*${search}*,namespace.ilike.*${search}*)`;
  } else {
    const filterQueries: string[] = [];
    if (label && label !== "All") {
      const [k, v] = decodeURI(label).split("__:__");
      filterQueries.push(`labels->>${k}=eq.${encodeURIComponent(v)}`);
    }
    if (labels) {
      labels.split(",").forEach((label) => {
        const [k, v] = label.split("__:__");
        if (!isNull(v)) {
          filterQueries.push(`labels->>${k}=eq.${encodeURIComponent(v)}`);
        } else {
          filterQueries.push(`labels->>${k}=is.null`);
        }
      });
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

export const useHealthCheckSpecQuery = (
  canaryID: string,
  /* todo: think of a better way to formulate types for the query options */
  { enabled = true, ...rest }
) => {
  return useQuery(
    ["db", "resource", "canaries", canaryID],
    () => getHealthCheckSpecByID(canaryID),
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

export function useGetConfigChangesByConfigIdQuery(
  id: string,
  pageIndex?: number,
  pageSize?: number,
  keepPreviousData?: boolean,
  starts_at?: string,
  ends_at?: string,
  severity?: string,
  change_type?: string
) {
  return useQuery(
    [
      "configs",
      "changes",
      id,
      pageIndex,
      pageSize,
      starts_at,
      ends_at,
      severity,
      change_type
    ],
    () =>
      getConfigChanges(
        id,
        pageIndex,
        pageSize,
        starts_at,
        ends_at,
        severity,
        change_type
      ),
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

export function useGetConfigTagsListQuery(
  options?: UseQueryOptions<ConfigsTagList[]>
) {
  return useQuery({
    queryKey: ["configs", "tags", "list"],
    queryFn: async () => {
      const { data } = await getConfigTagsList();
      return data ?? [];
    },
    ...options
  });
}

export function useGetConfigLabelsListQuery() {
  return useQuery({
    queryKey: ["configs", "tags", "list"],
    queryFn: async () => {
      const { error, data } = await getConfigLabelsList();
      if (error) {
        throw error;
      }
      return data ?? [];
    }
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

export function useGetConfigInsights(
  configId: string,
  pageIndex?: number,
  pageSize?: number,
  keepPreviousData?: boolean,
  isEnabled?: boolean
) {
  return useQuery(
    ["configs", "insights", configId, pageIndex, pageSize],
    () => getConfigInsights(configId, pageIndex, pageSize),
    {
      enabled: isEnabled,
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

export function useGetTopologyRelatedInsightsQuery(
  id: string,
  pageIndex?: number,
  pageSize?: number,
  keepPreviousData?: boolean,
  isEnabled?: boolean
) {
  return useQuery(
    ["topology", "insights", id, pageIndex, pageSize],
    async () => getTopologyRelatedInsights(id, pageIndex, pageSize),
    {
      enabled: isEnabled,
      keepPreviousData,
      select: (response) => {
        return {
          ...response,
          data: response?.data?.map((item) =>
            item.config.analysis.find((a) => a.id === item.analysis_id)
          )
        };
      }
    }
  );
}
