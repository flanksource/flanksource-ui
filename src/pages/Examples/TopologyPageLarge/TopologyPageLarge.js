import React, { useState } from "react";
import { TopologyPageLargeView } from "./TopologyPageLargeView";
import topology from "../../../data/topology.json";

export const TopologyPageLarge = () => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [checked, setChecked] = useState({});
  const toggleChecked = (id, checked) => {
    setChecked((prevState) => ({ ...prevState, [id]: checked }));
  };

  return (
    <TopologyPageLargeView
      topology={topology}
      checked={checked}
      selectionMode={selectionMode}
      setSelectionMode={setSelectionMode}
      toggleChecked={toggleChecked}
    />
  );
};
