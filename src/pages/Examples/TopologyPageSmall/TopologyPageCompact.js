import React from "react";
import topology from "../../../data/topology.json";
import { TopologyPageCompactView } from "./TopologyPageCompactView";

export const TopologyPageCompact = () => (
  <TopologyPageCompactView topology={topology} />
);
