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

/** Identifies obsolete custom limits that cannot be represented by named Scopes. */
export function hasLegacyScopeLimit(): boolean {
  try {
    return (
      getImpersonatedScopeIds().length === 0 &&
      !!sessionStorage.getItem(PAYLOAD_KEY)
    );
  } catch {
    return false;
  }
}

/** Applies named limits or clears them; returns false if session storage fails. */
export function setImpersonatedScopes(ids: string[]): boolean {
  try {
    // Clean legacy state before changing the IDs so cleanup failure retains the current limit.
    sessionStorage.removeItem(PAYLOAD_KEY);
    sessionStorage.removeItem(MODE_KEY);
    sessionStorage.removeItem(TARGETS_KEY);

    if (ids.length === 0) {
      sessionStorage.removeItem(IDS_KEY);
    } else {
      sessionStorage.setItem(IDS_KEY, JSON.stringify(ids));
    }
  } catch {
    return false;
  }
  window.dispatchEvent(new CustomEvent(SCOPE_IMPERSONATION_CHANGE_EVENT));
  return true;
}

/** Removes the request limit, notifying subscribers only after storage succeeds. */
export function clearImpersonatedScopes(): boolean {
  return setImpersonatedScopes([]);
}

/** Whether named Scope limits are active, independent of legacy payload storage. */
export function hasImpersonatedScopes(): boolean {
  return getImpersonatedScopeIds().length > 0;
}
