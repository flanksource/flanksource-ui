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
const DEFAULT_BASE_PATH = "/scrapeui";

const SEARCH_TAB_KEY = "scrapeTab";
const SEARCH_ID_KEY = "scrapeId";
const SEARCH_Q_KEY = "scrapeQ";

export function parseRoute(
  path: string,
  search: string,
  basePath = DEFAULT_BASE_PATH
): Route {
  const baseStripped = path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
  const segments = baseStripped
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);
  const params = new URLSearchParams(search);
  const q = params.get("q") || undefined;

  if (segments.length === 0) {
    return { tab: DEFAULT_TAB, q };
  }

  const first = segments[0];
  if (VALID_TABS.includes(first as Tab)) {
    return {
      tab: first as Tab,
      id: segments[1] ? decodeURIComponent(segments[1]) : undefined,
      q
    };
  }

  return { tab: DEFAULT_TAB, q };
}

export function buildPath(route: Route, basePath = DEFAULT_BASE_PATH): string {
  let path = `${basePath}/` + route.tab;
  if (route.id) path += "/" + encodeURIComponent(route.id);
  if (route.q) path += "?q=" + encodeURIComponent(route.q);
  return path;
}

function readHashRoute(basePath: string): Route {
  const raw = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const [pathPart, queryPart] = raw.split("?");
  const path = pathPart || "/";
  const search = queryPart ? `?${queryPart}` : "";
  return parseRoute(path, search, basePath);
}

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
  basePath?: string;
  mode?: "path" | "hash" | "search";
}): [Route, (next: Partial<Route>) => void] {
  const syncWithURL = options?.syncWithURL ?? true;
  const basePath = options?.basePath ?? DEFAULT_BASE_PATH;
  const mode = options?.mode ?? "path";

  const location = useLocation();
  const navigateURL = useNavigate();

  const [route, setRoute] = useState<Route>(() => {
    if (!syncWithURL) {
      return { tab: DEFAULT_TAB };
    }
    if (mode === "hash") {
      return readHashRoute(basePath);
    }
    if (mode === "search") {
      return readSearchRoute(location.search);
    }
    return parseRoute(location.pathname, location.search, basePath);
  });

  useEffect(() => {
    if (!syncWithURL || mode !== "path") return;
    setRoute(parseRoute(location.pathname, location.search, basePath));
  }, [syncWithURL, mode, basePath, location.pathname, location.search]);

  useEffect(() => {
    if (!syncWithURL || mode !== "search") return;
    setRoute(readSearchRoute(location.search));
  }, [syncWithURL, mode, location.search]);

  useEffect(() => {
    if (!syncWithURL || mode !== "hash") return;

    const onHash = () => setRoute(readHashRoute(basePath));
    window.addEventListener("hashchange", onHash);

    if (!window.location.hash) {
      window.location.hash = buildPath({ tab: DEFAULT_TAB }, basePath);
    }

    return () => window.removeEventListener("hashchange", onHash);
  }, [syncWithURL, mode, basePath]);

  const navigate = useCallback(
    (next: Partial<Route>) => {
      setRoute((prev) => {
        const merged: Route = {
          tab: next.tab ?? prev.tab,
          id: "id" in next ? next.id : prev.id,
          q: "q" in next ? next.q : prev.q
        };

        if (syncWithURL) {
          if (mode === "path") {
            const path = buildPath(merged, basePath);
            if (location.pathname + location.search !== path) {
              navigateURL(path);
            }
          } else if (mode === "hash") {
            const path = buildPath(merged, basePath);
            if (window.location.hash !== `#${path}`) {
              window.location.hash = path;
            }
          } else {
            const search = buildSearch(merged, location.search);
            if (location.search !== search) {
              navigateURL(`${location.pathname}${search}`, { replace: true });
            }
          }
        }

        return merged;
      });
    },
    [
      basePath,
      syncWithURL,
      mode,
      location.pathname,
      location.search,
      navigateURL
    ]
  );

  return [route, navigate];
}
