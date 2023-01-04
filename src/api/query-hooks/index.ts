import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { toastError } from "../../components/Toast/toast";
import {
  getAllChanges,
  getAllConfigsMatchingQuery,
  getConfig,
  getConfigChange,
  getConfigName
} from "../services/configs";
import { getHypothesisResponse } from "../services/hypothesis";
import { getIncident } from "../services/incident";
import {
  ComponentTeamItem,
  getComponentTeams,
  getHealthCheckItem,
  getTopology,
  getTopologyComponentLabels,
  getTopologyComponents
} from "../services/topology";
import { getPersons } from "../services/users";

const cache: Record<string, any> = {};

const defaultStaleTime = 1000 * 60 * 5;

export const createIncidentQueryKey = (id: string) => ["getIncident", id];

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

function prepareConfigListQuery({
  search,
  configType,
  tag,
  sortBy,
  sortOrder
}: Record<string, string | null | undefined>) {
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
  return query;
}

export const useAllConfigsQuery = (
  {
    search,
    tag,
    configType,
    sortBy,
    sortOrder
  }: Record<string, string | null | undefined>,
  { enabled = true, staleTime = defaultStaleTime, ...rest }
) => {
  const query = prepareConfigListQuery({
    search,
    tag,
    configType,
    sortBy,
    sortOrder
  });
  return useQuery(
    ["allConfigs", search, tag, configType, sortBy, sortOrder],
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

export function useGetAllConfigsChangesQuery() {
  return useQuery(["configs", "changes", "all"], getAllChanges, {
    select: (res) => {
      if (res.error) {
        throw new Error(res.error.message);
      }
      return res?.data?.length === 0 ? [] : res?.data;
    },
    onError: (err: any) => {
      toastError(err);
    }
  });
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
      onError: (err: any) => toastError(err)
    }
  );
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
