import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
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

const FeatureFlagsContext = createContext(initialState);

export const FeatureFlagsContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [featureFlags, setFeatureFlags] = useState(initialState.featureFlags);
  const [featureFlagsLoaded, setFeatureFlagsLoaded] = useState(
    initialState.featureFlagsLoaded
  );

  const refreshFeatureFlags = useCallback(async () => {
    const { data = [] } = await permissionService.loadProperties();
    setFeatureFlags(data!);
    setFeatureFlagsLoaded(true);
  }, []);

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
