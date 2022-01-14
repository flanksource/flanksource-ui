import React from "react";
import topology from "../../../data/topology.json";
import { TopologyPageView } from "./TopologyPageView";

export const TopologyPage = () => (
  <TopologyPageView
    topology={topology[0].components[0].components[0].properties}
  />
);

TopologyPage.propTypes = {};
