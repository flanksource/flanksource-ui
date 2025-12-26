import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

type AiFeatureLoaderContextValue = {
  requestAiFeatures: () => void;
  aiLoaded: boolean;
};

const AiFeatureLoaderContext =
  createContext<AiFeatureLoaderContextValue | null>(null);

export function AiFeatureLoaderProvider({ children }: { children: ReactNode }) {
  const [aiLoaded, setAiLoaded] = useState(false);

  const requestAiFeatures = useCallback(() => {
    setAiLoaded(true);
  }, [setAiLoaded]);

  return (
    <AiFeatureLoaderContext.Provider value={{ requestAiFeatures, aiLoaded }}>
      {children}
    </AiFeatureLoaderContext.Provider>
  );
}

export function useAiFeatureLoader() {
  const context = useContext(AiFeatureLoaderContext);
  if (!context) {
    throw new Error(
      "useAiFeatureLoader must be used within AiFeatureLoaderProvider"
    );
  }
  return context;
}

export function AiFeatureRequest({ children }: { children: ReactNode }) {
  const { requestAiFeatures } = useAiFeatureLoader();

  useEffect(() => {
    requestAiFeatures();
  }, [requestAiFeatures]);

  return children;
}
