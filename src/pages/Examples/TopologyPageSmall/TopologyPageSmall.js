import React from "react";
import topology from "../../../data/topology.json";
import { TopologyPageSmallView } from "./TopologyPageSmallView";
import { TopologyCardSmall } from "../../../components/TopologyCards";
import { cardStatusBorderTop } from "../../../utils/common";

export const TopologyPageSmall = () => {
  const cards = topology.map(({ name, status }) => (
    <TopologyCardSmall
      key={name}
      title={name}
      statusColor={cardStatusBorderTop(status)}
    />
  ));
  return <TopologyPageSmallView cards={cards} />;
};
