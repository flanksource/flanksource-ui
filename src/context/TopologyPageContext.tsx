import React, { useState, createContext, useContext } from "react";
import { URLSearchParamsInit } from "react-router-dom";
import { severityItems, typeItems } from "../components/Incidents/data";

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
  components?: Record<string, any>[];
  labels?: Record<string, string>;
  path?: string;
  icon?: string;
  text?: string;
  status?: string;
  summary?: {
    incidents?: Record<
      keyof typeof typeItems,
      Record<"High" | "Medium" | "Low", number>
    >;
    insights?: Record<string, any>;
    [key: string]: any;
  };
};

export type TopologyState = {
  topology: Topology[] | null;
  searchParams: URLSearchParamsInit;
};

export type TopologyPageState = {
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
