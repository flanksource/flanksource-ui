// ABOUTME: React hook that syncs impersonated scope state from sessionStorage.
// ABOUTME: Listens for custom events so all consumers stay in sync.

import { ScopeDB } from "@flanksource-ui/api/types/scopes";
import { useCallback, useSyncExternalStore } from "react";
import {
  clearImpersonatedScopes,
  SCOPE_IMPERSONATION_CHANGE_EVENT,
  setImpersonatedScopes
} from "./scopeImpersonationStore";

function subscribe(callback: () => void) {
  window.addEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, callback);
  return () =>
    window.removeEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, callback);
}

function getSnapshot(): string {
  return sessionStorage.getItem("flanksource-impersonated-scope-ids") ?? "";
}

function getServerSnapshot(): string {
  return "";
}

export function useImpersonatedScopes() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const scopeIds: string[] = raw ? JSON.parse(raw) : [];
  const active = scopeIds.length > 0;

  const set = useCallback(
    (scopes: ScopeDB[]) => setImpersonatedScopes(scopes),
    []
  );
  const clear = useCallback(() => clearImpersonatedScopes(), []);

  return { scopeIds, active, set, clear };
}
