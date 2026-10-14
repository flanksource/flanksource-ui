// ABOUTME: React hook that syncs impersonated scope state from sessionStorage.
// ABOUTME: Listens for custom events so all consumers stay in sync.

import { useCallback, useSyncExternalStore } from "react";
import {
  clearImpersonatedScopes,
  getImpersonatedScopeIds,
  hasLegacyScopeLimit,
  SCOPE_IMPERSONATION_CHANGE_EVENT,
  setImpersonatedScopes
} from "./scopeImpersonationStore";

function subscribe(callback: () => void) {
  window.addEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, callback);
  return () =>
    window.removeEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, callback);
}

function getSnapshot(): string {
  return JSON.stringify({
    scopeIds: getImpersonatedScopeIds(),
    legacyLimit: hasLegacyScopeLimit()
  });
}

function getServerSnapshot(): string {
  return JSON.stringify({ scopeIds: [], legacyLimit: false });
}

/** Keeps the scope picker in sync with the named request limits stored for this session. */
export function useImpersonatedScopes() {
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const scopeIds = getImpersonatedScopeIds();
  const legacyLimit = hasLegacyScopeLimit();
  const active = scopeIds.length > 0;

  const setScopes = useCallback(
    (ids: string[]) => setImpersonatedScopes(ids),
    []
  );
  const clear = useCallback(() => clearImpersonatedScopes(), []);

  return { scopeIds, legacyLimit, active, setScopes, clear };
}
