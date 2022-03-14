import React, { useState } from "react";
import { TopologySelectorModalPageView } from "./TopologySelectorModalPageView";
import { topologiesFactory } from "../../../data/topologies";
import { MinimalLayout } from "../../../components/Layout";

const topologies = topologiesFactory(5, 4);

export const TopologySelectorModalPage = () => {
  const [modal, setModal] = useState(false);

  return (
    <MinimalLayout>
      <TopologySelectorModalPageView
        modal={modal}
        setModal={setModal}
        topologies={topologies}
      />
    </MinimalLayout>
  );
};
