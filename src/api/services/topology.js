import { isArray, flattenDepth } from "lodash";
import { CanaryChecker } from "../axios";
import { resolve } from "../resolve";

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
    items.push(topology);

    for (const item of topology) {
      items.push(...unroll(item.components, depth - 1));
    }
  }
  return flattenDepth(items, 3);
}

export const getTopology = async (id, depth = 3) => {
  let query = "";
  if (id != null) {
    query = `?id=eq.${id}`;
  }
  return resolve(
    CanaryChecker.get(`/api/topology${query}`)
      .then((results) => ({ data: unroll(results.data, depth) }))
      .catch((e) => console.error("failed", e))
  );
};

export const getCanaries = async () => resolve(CanaryChecker.get("/api"));
