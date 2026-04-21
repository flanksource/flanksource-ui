import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Tab } from "../types";

export interface Route {
  tab: Tab;
  id?: string;
  q?: string;
}

const VALID_TABS: Tab[] = [
  "configs",
  "logs",
  "har",
  "users",
  "groups",
  "roles",
  "access",
  "access_logs",
  "issues",
  "snapshot",
  "last_summary",
  "spec"
];

const DEFAULT_TAB: Tab = "spec";

const SEARCH_TAB_KEY = "scrapeTab";
const SEARCH_ID_KEY = "scrapeId";
const SEARCH_Q_KEY = "scrapeQ";

function readSearchRoute(search: string): Route {
  const params = new URLSearchParams(search);
  const tab = params.get(SEARCH_TAB_KEY);
  return {
    tab: VALID_TABS.includes(tab as Tab) ? (tab as Tab) : DEFAULT_TAB,
    id: params.get(SEARCH_ID_KEY) || undefined,
    q: params.get(SEARCH_Q_KEY) || undefined
  };
}

function buildSearch(route: Route, search: string): string {
  const params = new URLSearchParams(search);
  params.set(SEARCH_TAB_KEY, route.tab);

  if (route.id) {
    params.set(SEARCH_ID_KEY, route.id);
  } else {
    params.delete(SEARCH_ID_KEY);
  }

  if (route.q) {
    params.set(SEARCH_Q_KEY, route.q);
  } else {
    params.delete(SEARCH_Q_KEY);
  }

  const value = params.toString();
  return value ? `?${value}` : "";
}

export function useRoute(options?: {
  syncWithURL?: boolean;
}): [Route, (next: Partial<Route>) => void] {
  const syncWithURL = options?.syncWithURL ?? true;

  const location = useLocation();
  const navigateURL = useNavigate();

  const [route, setRoute] = useState<Route>(() => {
    if (!syncWithURL) {
      return { tab: DEFAULT_TAB };
    }

    return readSearchRoute(location.search);
  });

  useEffect(() => {
    if (!syncWithURL) return;
    setRoute(readSearchRoute(location.search));
  }, [syncWithURL, location.search]);

  const navigate = useCallback(
    (next: Partial<Route>) => {
      setRoute((prev) => {
        const merged: Route = {
          tab: next.tab ?? prev.tab,
          id: "id" in next ? next.id : prev.id,
          q: "q" in next ? next.q : prev.q
        };

        if (syncWithURL) {
          const search = buildSearch(merged, location.search);
          if (location.search !== search) {
            navigateURL(`${location.pathname}${search}`, { replace: true });
          }
        }

        return merged;
      });
    },
    [syncWithURL, location.pathname, location.search, navigateURL]
  );

  return [route, navigate];
}
