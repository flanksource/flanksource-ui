import React, { createContext, useContext, useState } from "react";

export type IncidentState = {
  incidents: any[] | null;
  ownerSelections: any[] | null;
};

export type IncidentPageState = {
  incidentState: IncidentState;
  setIncidentState: ({ ...props }: IncidentState) => any;
};

const initialState: IncidentPageState = {
  incidentState: {
    incidents: [],
    ownerSelections: []
  },
  setIncidentState: ({ ...props }) => {}
};

const IncidentPageContext = createContext(initialState);

export const IncidentPageContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [incidentState, setIncidentState] = useState({
    ...initialState.incidentState
  });
  return (
    <IncidentPageContext.Provider value={{ incidentState, setIncidentState }}>
      {children}
    </IncidentPageContext.Provider>
  );
};

export const useIncidentPageContext = () => {
  const context = useContext(IncidentPageContext);

  if (context === undefined) {
    throw new Error(
      "useIncidentPageContext must be used within a IncidentPageContextProvider"
    );
  }
  return context;
};
