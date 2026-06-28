// ABOUTME: Records getting-started touchpoints derived from the current route/URL.
// ABOUTME: Centralizes the navigation-based checklist items so pages stay uninstrumented.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  useCompletedTouchpoints,
  useRecordTouchpoint,
  useRecordTouchpointOnMount
} from "./useTouchpoints";

/** Maps the current pathname + params to the touchpoint keys it satisfies. */
function touchpointsForLocation(pathname: string, params: URLSearchParams) {
  const keys: string[] = [];
  if (pathname === "/health") {
    keys.push("health.view");
    if (params.get("checkId")) {
      keys.push("health.open-check");
    }
  }
  if (pathname === "/catalog") {
    keys.push("catalog.view");
    if (params.get("configType")) {
      keys.push("catalog.open-type");
    }
  }
  if (/^\/catalog\/[0-9a-f]{8}-/i.test(pathname)) {
    keys.push("catalog.view-item");
  }
  if (pathname === "/playbooks") {
    keys.push("playbooks.view");
  }
  if (/^\/playbooks\/runs\/[0-9a-f]{8}-/i.test(pathname)) {
    keys.push("playbooks.view-run");
  }
  if (/^\/views?\//i.test(pathname)) {
    keys.push("views.open");
  }
  return keys;
}

/** Records a touchpoint when this renders. Place inside content that only
 * mounts when the user views it (e.g. an active-only tab panel). */
export function RecordTouchpointOnMount({ id }: { id: string }) {
  useRecordTouchpointOnMount(id);
  return null;
}

export function TouchpointObserver() {
  const { pathname, search } = useLocation();
  const record = useRecordTouchpoint();
  // Prime the completed-keys cache so recording can skip already-done items.
  useCompletedTouchpoints();

  useEffect(() => {
    const params = new URLSearchParams(search);
    touchpointsForLocation(pathname, params).forEach(record);
  }, [pathname, search, record]);

  return null;
}
