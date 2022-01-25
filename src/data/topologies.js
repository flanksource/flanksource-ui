import { v4 as uuid } from "uuid";
import topology from "./topology.json";

export const topologiesFactory = (
  topologiesNumber = 1,
  topologyItemsNumber = 1
) => {
  const getItems = (n) =>
    Array(n)
      .fill(topology[0])
      .map((topologyItem) => ({ ...topologyItem, id: uuid() }));

  return Array(topologiesNumber).fill(topologyItemsNumber).map(getItems);
};
