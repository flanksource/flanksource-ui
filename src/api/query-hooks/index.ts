import { useQuery } from "@tanstack/react-query";
import { getAllConfigs, getConfigName } from "../services/configs";
import { getIncident } from "../services/incident";
import {
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

export const useAllConfigsQuery = ({
  enabled = true,
  staleTime = defaultStaleTime,
  ...rest
}) => {
  return useQuery(["allConfigs"], getAllConfigs, {
    staleTime,
    enabled,
    ...rest
  });
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
