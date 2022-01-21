import React from "react";
import { TopologyPageLargeView } from "./TopologyPageLargeView";
import topology from "../../../data/topology.json";

export const TopologyPageLarge = () => (
  <TopologyPageLargeView topology={topology} />
);
