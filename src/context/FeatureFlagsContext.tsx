import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useGetFeatureFlagsFromAPI } from "../api/query-hooks/useFeatureFlags";
import { features } from "../services/permissions/features";
import {
  FeatureFlag,
  permissionService
} from "../services/permissions/permissionsService";

export type FeatureFlagsState = {
  featureFlags: FeatureFlag[];
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

export const FeatureFlagsContext = createContext(initialState);

export const FeatureFlagsContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const {
    data: featureFlags = [],
    isSuccess,
    refetch
  } = useGetFeatureFlagsFromAPI();

  const refreshFeatureFlags = useCallback(() => {
    refetch();
  }, [refetch]);

  const isFeatureDisabled = useCallback(
    (featureName: string) => {
      return permissionService.isFeatureDisabled(featureName, featureFlags);
    },
    [featureFlags]
  );

  const contextValue = useMemo(
    () => ({
      featureFlags,
      featureFlagsLoaded: isSuccess,
      refreshFeatureFlags,
      isFeatureDisabled
    }),
    [featureFlags, isSuccess, refreshFeatureFlags, isFeatureDisabled]
  );

  return (
    <FeatureFlagsContext.Provider value={contextValue}>
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
