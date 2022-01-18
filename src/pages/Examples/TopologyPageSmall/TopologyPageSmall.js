import React from "react";
import topology from "../../../data/topology.json";
import { TopologyPageSmallView } from "./TopologyPageSmallView";

export const TopologyPageSmall = () => (
  <TopologyPageSmallView
    topology={topology[0].components[0].components[0].properties}
  />
);
