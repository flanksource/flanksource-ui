import React from "react";
import { TopologyPageFullView } from "./TopologyPageFullView";
import topology from "../../../data/topology.json";

export const TopologyPageFull = () => (
  <TopologyPageFullView topology={topology} />
);
