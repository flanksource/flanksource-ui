import { useState, useEffect, useCallback } from "react";
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
const BASE_PATH = "/scrapeui";

export function parseRoute(path: string, search: string): Route {
  const baseStripped = path.startsWith(BASE_PATH)
    ? path.slice(BASE_PATH.length) || "/"
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

export function buildPath(route: Route): string {
  let path = `${BASE_PATH}/` + route.tab;
  if (route.id) path += "/" + encodeURIComponent(route.id);
  if (route.q) path += "?q=" + encodeURIComponent(route.q);
  return path;
}

export function useRoute(): [Route, (next: Partial<Route>) => void] {
  const [route, setRoute] = useState<Route>(() =>
    parseRoute(window.location.pathname, window.location.search)
  );

  useEffect(() => {
    const onPop = () => {
      setRoute(parseRoute(window.location.pathname, window.location.search));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((next: Partial<Route>) => {
    setRoute((prev) => {
      const merged: Route = {
        tab: next.tab ?? prev.tab,
        id: "id" in next ? next.id : prev.id,
        q: "q" in next ? next.q : prev.q
      };
      const path = buildPath(merged);
      if (window.location.pathname + window.location.search !== path) {
        window.history.pushState(null, "", path);
      }
      return merged;
    });
  }, []);

  return [route, navigate];
}
