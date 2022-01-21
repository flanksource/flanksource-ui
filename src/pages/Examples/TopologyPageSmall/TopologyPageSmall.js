import React, { useState } from "react";
import topology from "../../../data/topology.json";
import { TopologyPageSmallView } from "./TopologyPageSmallView";

export const TopologyPageSmall = () => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [checked, setChecked] = useState({});
  const toggleChecked = (id, checked) => {
    setChecked((prevState) => ({ ...prevState, [id]: checked }));
  };

  return (
    <TopologyPageSmallView
      topology={topology}
      checked={checked}
      selectionMode={selectionMode}
      setSelectionMode={setSelectionMode}
      toggleChecked={toggleChecked}
    />
  );
};
