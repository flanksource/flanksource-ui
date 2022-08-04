import React, { useState, createContext, useContext } from "react";
import { URLSearchParamsInit } from "react-router-dom";

type TopologyState = {
  topology: any[] | null;
  searchParams: URLSearchParamsInit;
};

type TopologyPageState = {
  topologyState: TopologyState;
  setTopologyState: ({ ...props }: TopologyState) => any;
};

const initialState: TopologyPageState = {
  topologyState: {
    topology: null,
    searchParams: {}
  },
  setTopologyState: ({ ...props }) => {}
};

const TopologyPageContext = createContext(initialState);

export const TopologyPageContextProvider = ({
  children
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  const [topologyState, setTopologyState] = useState({
    ...initialState.topologyState
  });
  return (
    <TopologyPageContext.Provider value={{ topologyState, setTopologyState }}>
      {children}
    </TopologyPageContext.Provider>
  );
};

export const useTopologyPageContext = () => {
  const context = useContext(TopologyPageContext);

  if (context === undefined) {
    throw new Error(
      "useTopologyPageContext must be used within a TopologyPageContextProvider"
    );
  }
  return context;
};
