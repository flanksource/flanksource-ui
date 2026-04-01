// ABOUTME: React hook that syncs impersonated scope state from sessionStorage.
// ABOUTME: Listens for custom events so all consumers stay in sync.

import { ScopeDB, ScopeTargetForm } from "@flanksource-ui/api/types/scopes";
import { useCallback, useSyncExternalStore } from "react";
import {
  clearImpersonatedScopes,
  getImpersonatedScopeIds,
  getImpersonatedTargets,
  getImpersonationMode,
  ImpersonationMode,
  SCOPE_IMPERSONATION_CHANGE_EVENT,
  setImpersonatedScopes,
  setImpersonatedTargets
} from "./scopeImpersonationStore";

function subscribe(callback: () => void) {
  window.addEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, callback);
  return () =>
    window.removeEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, callback);
}

function getSnapshot(): string {
  return sessionStorage.getItem("flanksource-impersonated-scope-payload") ?? "";
}

function getServerSnapshot(): string {
  return "";
}

export function useImpersonatedScopes() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const active = raw !== "";
  const scopeIds = getImpersonatedScopeIds();
  const mode: ImpersonationMode = getImpersonationMode();
  const targets: ScopeTargetForm[] = getImpersonatedTargets();

  const setScopes = useCallback(
    (scopes: ScopeDB[]) => setImpersonatedScopes(scopes),
    []
  );
  const setTargets = useCallback(
    (t: ScopeTargetForm[]) => setImpersonatedTargets(t),
    []
  );
  const clear = useCallback(() => clearImpersonatedScopes(), []);

  return { scopeIds, targets, mode, active, setScopes, setTargets, clear };
}
