import { createContext, ReactNode, useContext } from "react";

type ConfigDetailsContext = { baseRoute: string; embedded: boolean };

const ConfigDetailsBaseRouteContext = createContext<ConfigDetailsContext>({
  baseRoute: "/catalog",
  embedded: false
});

export function useConfigDetailsBaseRoute() {
  return useContext(ConfigDetailsBaseRouteContext).baseRoute;
}

export function useConfigDetailsEmbedded() {
  return useContext(ConfigDetailsBaseRouteContext).embedded;
}

export function ConfigDetailsBaseRouteProvider({
  baseRoute,
  embedded = false,
  children
}: {
  baseRoute: string;
  embedded?: boolean;
  children: ReactNode;
}) {
  return (
    <ConfigDetailsBaseRouteContext.Provider value={{ baseRoute, embedded }}>
      {children}
    </ConfigDetailsBaseRouteContext.Provider>
  );
}
