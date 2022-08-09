import React, { useState, createContext, useContext } from "react";
import { URLSearchParamsInit } from "react-router-dom";

export type ConfigState = {
  data: any[] | null;
  filteredData: any[] | null;
};

export type ConfigPageState = {
  configState: ConfigState;
  setConfigState: ({ ...props }: ConfigState) => any;
};

const initialState: ConfigPageState = {
  configState: {
    data: [],
    filteredData: []
  },
  setConfigState: ({ ...props }) => {}
};

const ConfigPageContext = createContext(initialState);

export const ConfigPageContextProvider = ({
  children
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  const [configState, setConfigState] = useState({
    ...initialState.configState
  });
  return (
    <ConfigPageContext.Provider value={{ configState, setConfigState }}>
      {children}
    </ConfigPageContext.Provider>
  );
};

export const useConfigPageContext = () => {
  const context = useContext(ConfigPageContext);

  if (context === undefined) {
    throw new Error(
      "useConfigPageContext must be used within a ConfigPageContextProvider"
    );
  }
  return context;
};
