import React, { useState, createContext, useContext, useEffect } from "react";
import {
  Property,
  permissionService
} from "../services/permissions/permissionsService";
import { features } from "../services/permissions/features";

export type FeatureFlagsState = {
  featureFlags: Property[];
  featureFlagsLoaded: boolean;
  refreshFeatureFlags: () => void;
  isFeatureDisabled: (_: keyof typeof features) => boolean;
};

const initialState: FeatureFlagsState = {
  featureFlags: [],
  featureFlagsLoaded: false,
  refreshFeatureFlags: () => {},
  isFeatureDisabled: (_) => false
};

const FeatureFlagsContext = createContext(initialState);

export const FeatureFlagsContextProvider = ({
  children
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  const [featureFlags, setFeatureFlags] = useState(initialState.featureFlags);
  const [featureFlagsLoaded, setFeatureFlagsLoaded] = useState(
    initialState.featureFlagsLoaded
  );

  const refreshFeatureFlags = async () => {
    const { data = [] } = await permissionService.loadProperties();
    setFeatureFlags(data!);
    setFeatureFlagsLoaded(true);
  };

  const isFeatureDisabled = (featureName: string) => {
    return permissionService.isFeatureDisabled(featureName, featureFlags);
  };

  useEffect(() => {
    refreshFeatureFlags();
  }, []);

  return (
    <FeatureFlagsContext.Provider
      value={{
        featureFlags,
        featureFlagsLoaded,
        refreshFeatureFlags,
        isFeatureDisabled
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlagsContext = () => {
  const context = useContext(FeatureFlagsContext);

  if (context === undefined) {
    throw new Error(
      "useFeatureFlagsContext must be used within a FeatureFlagsContextProvider"
    );
  }
  return context;
};
