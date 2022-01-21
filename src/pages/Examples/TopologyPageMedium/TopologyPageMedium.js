import React, { useState } from "react";
import { TopologyPageMediumView } from "./TopologyPageMediumView";
import topology from "../../../data/topology.json";

export const TopologyPageMedium = () => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [checked, setChecked] = useState({});
  const toggleChecked = (id, checked) => {
    setChecked((prevState) => ({ ...prevState, [id]: checked }));
  };

  return (
    <TopologyPageMediumView
      topology={topology}
      checked={checked}
      selectionMode={selectionMode}
      setSelectionMode={setSelectionMode}
      toggleChecked={toggleChecked}
    />
  );
};
