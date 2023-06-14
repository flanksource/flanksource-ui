import React, { useState, createContext, useContext } from "react";
import { URLSearchParamsInit } from "react-router-dom";
import { CostsData } from "../components/CostDetails/CostDetails";
import { typeItems } from "../components/Incidents/data";

export type ValueType = number | string | Date;

export type TopologyProperty = {
  name: string;
  icon?: string;
  label?: string;
  type?: string;
  text?: string;
  max?: number;
  min?: number;
  headline?: boolean;
  value?: ValueType;
  unit?: string;
  color?: string;
};

export type Topology = {
  id: string;
  parent_id?: string;
  name: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
  title?: string;
  properties?: TopologyProperty[];
  components?: Topology[];
  labels?: Record<string, string>;
  path?: string;
  icon?: string;
  text?: string;
  status?: string;
  hidden?: boolean;
  external_id?: string;
  agent_id?: string;
  topology_id?: string;
  summary?: {
    incidents?: Record<
      keyof typeof typeItems,
      Record<"High" | "Medium" | "Low", number>
    >;
    insights?: Record<string, any>;
    [key: string]: any;
  };
  logs: {
    name: string;
  }[];
} & CostsData;

export type TopologyState = {
  topology: Topology[] | undefined;
  searchParams: URLSearchParamsInit;
};

export type TopologyPageState = {
  topologyState: TopologyState;
  setTopologyState: ({ ...props }: TopologyState) => any;
};

const initialState: TopologyPageState = {
  topologyState: {
    topology: undefined,
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
