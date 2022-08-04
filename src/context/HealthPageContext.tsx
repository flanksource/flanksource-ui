import React, { useState, createContext, useContext } from "react";
import { URLSearchParamsInit } from "react-router-dom";

type HealthState = {
  checks: any[] | null;
  filteredChecks: any[];
  filteredLabels: any;
  passing: {
    checks: number;
    filtered: number;
  };
  searchParams: URLSearchParamsInit;
};

type HealthPageState = {
  healthState: HealthState;
  setHealthState: ({ ...props }: HealthState) => any;
};

const initialState: HealthPageState = {
  healthState: {
    checks: [],
    filteredChecks: [],
    filteredLabels: null,
    passing: {
      checks: 0,
      filtered: 0
    },
    searchParams: {}
  },
  setHealthState: ({ ...props }) => {}
};

const HealthPageContext = createContext(initialState);

export const HealthPageContextProvider = ({
  children
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  const [healthState, setHealthState] = useState({
    ...initialState.healthState
  });
  return (
    <HealthPageContext.Provider value={{ healthState, setHealthState }}>
      {children}
    </HealthPageContext.Provider>
  );
};

export const useHealthPageContext = () => {
  const context = useContext(HealthPageContext);

  if (context === undefined) {
    throw new Error(
      "useHealthPageContext must be used within a HealthPageContextProvider"
    );
  }
  return context;
};
