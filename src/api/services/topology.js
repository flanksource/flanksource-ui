import { flattenDepth, isArray, isEmpty } from "lodash";
import { stringify } from "qs";
import { CanaryChecker } from "../axios";

function compareStatus(a, b) {
  if (a.status === b.status) {
    return 0;
  }
  if (a.status === "unhealthy") {
    return -1;
  }
  return 1;
}

function unroll(topology, depth) {
  if (topology == null) {
    return [];
  }
  topology = flattenDepth([topology], 3);
  if (depth === 0) {
    return topology;
  }

  const items = [];

  if (isArray(topology)) {
    if (topology.type !== "summary") {
      items.push(topology);
    }

    for (const item of topology) {
      items.push(...unroll(item.components, depth - 1));
    }
  }
  items.sort((a, b) => {
    const status = compareStatus(a, b);
    if (status !== 0) {
      return status;
    }
    return a.name > b.name;
  });

  const flattened = flattenDepth(items, 3);
  if (
    isEmpty(flattened.id) &&
    flattened.components != null &&
    flattened.components.length === 1
  ) {
    return flattened.components[0];
  }
  return flattened;
}

export const getTopology = async (params) => {
  const query = stringify(params);
  return CanaryChecker.get(`/api/topology?${query}`).then((results) => {
    let depth = query === "" ? 0 : 2;
    if (params.depth != null) {
      depth = params.depth;
    }
    let { data } = results;
    if (data == null) {
      return { data: [] };
    }
    if (data.length === 2 && isEmpty(data[0].id)) {
      data = [data[1]];
    }
    return {
      data: unroll(data, depth, false)
    };
  });
};

export const getCanaries = async (params) => {
  const query = stringify(params);
  return CanaryChecker.get(`/api?${query}`);
};
