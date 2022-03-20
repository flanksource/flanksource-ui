import { v4 as uuid } from "uuid";
import topology from "./topology.json";

export const topologiesFactory = (topologiesNumber = 1) =>
  Array(topologiesNumber)
    .fill(topology[0])
    .map((topologyItem) => ({ ...topologyItem, id: uuid() }));
