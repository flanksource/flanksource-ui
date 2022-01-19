import React from "react";
import { TopologyPageMediumView } from "./TopologyPageMediumView";
import topology from "../../../data/topology.json";

export const TopologyPageMedium = () => (
  <TopologyPageMediumView topology={topology} />
);
