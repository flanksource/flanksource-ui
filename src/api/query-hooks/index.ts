import { useQuery } from "@tanstack/react-query";
import { getAllConfigsMatchingQuery } from "../services/configs";
import { getIncident } from "../services/incident";
import {
  getTopology,
  getTopologyComponentLabels,
  getTopologyComponents
} from "../services/topology";

const cache: Record<string, any> = {};

const defaultStaleTime = 1000 * 60 * 5;

export const createIncidentQueryKey = (id: string) => ["getIncident", id];

export const useIncidentQuery = (id = "") => {
  return useQuery(createIncidentQueryKey(id), () =>
    getIncident(id).then((response) => response.data)
  );
};

export const useComponentsQuery = ({
  enabled = true,
  staleTime = defaultStaleTime,
  ...rest
}) => {
  return useQuery(["allcomponents"], getTopologyComponents, {
    staleTime,
    enabled,
    ...rest
  });
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
        cache[topologyId] = data.data[0];
        return data.data[0];
      });
    },
    {
      staleTime,
      enabled,
      placeholderData: () => {
        return cache[topologyId];
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
    query = `&${query}or=(name.ilike.*${search}*,config_type.ilike.*${search}*,description.ilike.*${search}*,namespace.ilike.*${search}*)`;
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
    ["allConfigs"],
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
