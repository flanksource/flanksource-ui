import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState
} from "react";
import { URLSearchParamsInit } from "react-router-dom";
import { HealthCheck } from "../api/types/health";

export type HealthState = {
  checks: HealthCheck[] | null;
  filteredChecks: any[];
  filteredLabels: any;
  passing: {
    checks: number;
    filtered: number;
  };
  searchParams: URLSearchParamsInit;
};

export type HealthPageState = {
  healthState: HealthState;
  setHealthState: Dispatch<SetStateAction<HealthState>>;
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
  children: React.ReactNode;
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
