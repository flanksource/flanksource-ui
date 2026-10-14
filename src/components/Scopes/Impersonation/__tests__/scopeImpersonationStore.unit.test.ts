// ABOUTME: Tests for the scope impersonation sessionStorage helpers.
// ABOUTME: Validates Scope ID read/write/clear and custom event dispatching.

import {
  clearImpersonatedScopes,
  getImpersonatedScopeIds,
  hasImpersonatedScopes,
  SCOPE_IMPERSONATION_CHANGE_EVENT,
  setImpersonatedScopes
} from "../scopeImpersonationStore";

beforeEach(() => {
  sessionStorage.clear();
});

describe("getImpersonatedScopeIds", () => {
  it("returns empty array when nothing is stored", () => {
    expect(getImpersonatedScopeIds()).toEqual([]);
  });

  it("returns stored IDs", () => {
    sessionStorage.setItem(
      "flanksource-impersonated-scope-ids",
      JSON.stringify(["id-1", "id-2"])
    );
    expect(getImpersonatedScopeIds()).toEqual(["id-1", "id-2"]);
  });

  it("returns empty array for invalid JSON", () => {
    sessionStorage.setItem("flanksource-impersonated-scope-ids", "bad");
    expect(getImpersonatedScopeIds()).toEqual([]);
  });
});

describe("setImpersonatedScopes", () => {
  it("stores Scope IDs in sessionStorage", () => {
    setImpersonatedScopes(["abc", "def"]);

    expect(
      JSON.parse(sessionStorage.getItem("flanksource-impersonated-scope-ids")!)
    ).toEqual(["abc", "def"]);
  });

  it("removes keys when given empty array", () => {
    setImpersonatedScopes(["scope-1"]);
    setImpersonatedScopes([]);
    expect(
      sessionStorage.getItem("flanksource-impersonated-scope-ids")
    ).toBeNull();
    expect(
      sessionStorage.getItem("flanksource-impersonated-scope-payload")
    ).toBeNull();
    expect(
      sessionStorage.getItem("flanksource-impersonated-scope-mode")
    ).toBeNull();
  });

  it("dispatches a change event", () => {
    const handler = jest.fn();
    window.addEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, handler);
    setImpersonatedScopes(["scope-1"]);
    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, handler);
  });
});

describe("clearImpersonatedScopes", () => {
  it("removes all keys from sessionStorage and dispatches event", () => {
    setImpersonatedScopes(["scope-1"]);
    const handler = jest.fn();
    window.addEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, handler);

    clearImpersonatedScopes();

    expect(
      sessionStorage.getItem("flanksource-impersonated-scope-ids")
    ).toBeNull();
    expect(
      sessionStorage.getItem("flanksource-impersonated-scope-payload")
    ).toBeNull();
    expect(
      sessionStorage.getItem("flanksource-impersonated-scope-mode")
    ).toBeNull();
    expect(
      sessionStorage.getItem("flanksource-impersonated-scope-targets")
    ).toBeNull();
    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, handler);
  });
});

describe("hasImpersonatedScopes", () => {
  it("returns false when empty", () => {
    expect(hasImpersonatedScopes()).toBe(false);
  });

  it("returns true when Scopes are selected", () => {
    setImpersonatedScopes(["scope-1"]);
    expect(hasImpersonatedScopes()).toBe(true);
  });
});
