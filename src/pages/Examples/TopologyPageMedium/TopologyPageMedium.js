import React from "react";
import { TopologyPageMediumView } from "./TopologyPageMediumView";
import topology from "../../../data/topology.json";
import { TopologyCardMedium } from "../../../components/TopologyCards";
import { cardStatusBorderTop } from "../../../utils/common";

export const TopologyPageMedium = () => {
  const cards = topology.map((data) => (
    <TopologyCardMedium
      key={data.name}
      statusColor={cardStatusBorderTop(data.status)}
      data={data}
    />
  ));
  return <TopologyPageMediumView cards={cards} />;
};
