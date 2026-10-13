// Scope limits are stored as IDs; the backend resolves membership, not client-side selectors.

export const SCOPE_IMPERSONATION_CHANGE_EVENT = "scope-impersonation-change";

const IDS_KEY = "flanksource-impersonated-scope-ids";
const PAYLOAD_KEY = "flanksource-impersonated-scope-payload";
const MODE_KEY = "flanksource-impersonated-scope-mode";
const TARGETS_KEY = "flanksource-impersonated-scope-targets";

/** Returns the Scope IDs limiting this browser session's requests. */
export function getImpersonatedScopeIds(): string[] {
  try {
    const raw = sessionStorage.getItem(IDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** Applies named Scope limits; an empty selection clears the session filter. */
export function setImpersonatedScopes(ids: string[]): void {
  if (ids.length === 0) {
    sessionStorage.removeItem(IDS_KEY);
  } else {
    sessionStorage.setItem(IDS_KEY, JSON.stringify(ids));
  }

  // Discard obsolete selector-object/custom-target state from older sessions.
  sessionStorage.removeItem(PAYLOAD_KEY);
  sessionStorage.removeItem(MODE_KEY);
  sessionStorage.removeItem(TARGETS_KEY);
  window.dispatchEvent(new CustomEvent(SCOPE_IMPERSONATION_CHANGE_EVENT));
}

/** Removes the request limit and notifies subscribers. */
export function clearImpersonatedScopes(): void {
  setImpersonatedScopes([]);
}

/** Whether named Scope limits are active, independent of legacy payload storage. */
export function hasImpersonatedScopes(): boolean {
  return getImpersonatedScopeIds().length > 0;
}
