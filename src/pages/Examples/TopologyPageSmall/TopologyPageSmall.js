import React from "react";
import topology from "../../../data/topology.json";
import { TopologyPageSmallView } from "./TopologyPageSmallView";
import { TopologyCardSmall } from "../../../components/TopologyCards";

export const TopologyPageSmall = () => (
  <TopologyPageSmallView topology={topology} />
);
