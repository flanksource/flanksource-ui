import { isArray } from "lodash";
import { CanaryChecker } from "../axios";
import { resolve } from "../resolve";

function unroll(topology, depth) {
  if (depth === 0) {
    if (isArray(topology)) {
      return topology;
    }
    return [topology];
  }

  const items = [];

  if (isArray(topology)) {
    for (const item of topology) {
      items.push(...unroll(item, depth - 1));
    }
  } else {
    items.push(...unroll(topology, depth - 1));
  }
  return items;
}

export const getTopology = async (id, depth = 3) => {
  let query = "";
  if (id != null) {
    query = `?id=eq.${id}`;
  }
  return resolve(
    CanaryChecker.get(`/api/topology${query}`)

      .catch((e) => console.error("failed", e))
  );
};

export const getCanaries = async () => resolve(CanaryChecker.get("/api"));
