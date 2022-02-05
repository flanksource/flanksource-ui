import { flattenDepth, isArray } from "lodash";
import { stringify } from "qs";
import { CanaryChecker } from "../axios";
import { resolve } from "../resolve";

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

  let items = [];

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

  return flattenDepth(items, 3);
}

export const getTopology = async (params) => {
  const query = stringify(params);
  return CanaryChecker.get(`/api/topology?${query}`).then((results) => ({
    data: unroll(results.data, query == "" ? 0 : 2, false)
  }));
};

export const getCanaries = async () => resolve(CanaryChecker.get("/api"));
