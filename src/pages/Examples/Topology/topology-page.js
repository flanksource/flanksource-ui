import React, { useState } from "react";
import { MinimalLayout } from "../../../components/Layout";
import topology from "../../../data/topology.json";
import { TopologyView } from "./topology-view";

export const TopologyPage = () => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [checked, setChecked] = useState({});
  const toggleChecked = (id, checked) => {
    setChecked((prevState) => ({ ...prevState, [id]: checked }));
  };

  return (
    <MinimalLayout>
      <TopologyView
        topology={topology}
        checked={checked}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        toggleChecked={toggleChecked}
      />
    </MinimalLayout>
  );
};
