// ABOUTME: Tests for the scope impersonation sessionStorage helpers.
// ABOUTME: Validates read/write/clear, payload building, and custom event dispatching.

import { ScopeDB } from "@flanksource-ui/api/types/scopes";
import {
  buildPayload,
  clearImpersonatedScopes,
  getImpersonatedPayload,
  getImpersonatedScopeIds,
  hasImpersonatedScopes,
  SCOPE_IMPERSONATION_CHANGE_EVENT,
  setImpersonatedScopes
} from "../scopeImpersonationStore";

beforeEach(() => {
  sessionStorage.clear();
});

function makeScope(overrides: Partial<ScopeDB> = {}): ScopeDB {
  return {
    id: "scope-1",
    name: "test",
    targets: [],
    source: "UI",
    created_at: "",
    updated_at: "",
    ...overrides
  };
}

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
  it("stores IDs and payload in sessionStorage", () => {
    const scope = makeScope({
      id: "abc",
      targets: [{ config: { name: "my-config", agent: "agent-1" } }]
    });
    setImpersonatedScopes([scope]);

    expect(
      JSON.parse(sessionStorage.getItem("flanksource-impersonated-scope-ids")!)
    ).toEqual(["abc"]);

    const payload = JSON.parse(
      sessionStorage.getItem("flanksource-impersonated-scope-payload")!
    );
    expect(payload.config).toEqual([
      { names: ["my-config"], agents: ["agent-1"] }
    ]);
    expect(payload.scopes).toEqual(["abc"]);
  });

  it("removes keys when given empty array", () => {
    sessionStorage.setItem("flanksource-impersonated-scope-ids", "[]");
    sessionStorage.setItem("flanksource-impersonated-scope-payload", "{}");
    setImpersonatedScopes([]);
    expect(
      sessionStorage.getItem("flanksource-impersonated-scope-ids")
    ).toBeNull();
    expect(
      sessionStorage.getItem("flanksource-impersonated-scope-payload")
    ).toBeNull();
  });

  it("dispatches a change event", () => {
    const handler = jest.fn();
    window.addEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, handler);
    setImpersonatedScopes([makeScope()]);
    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, handler);
  });
});

describe("clearImpersonatedScopes", () => {
  it("removes from sessionStorage and dispatches event", () => {
    setImpersonatedScopes([makeScope()]);
    const handler = jest.fn();
    window.addEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, handler);

    clearImpersonatedScopes();

    expect(
      sessionStorage.getItem("flanksource-impersonated-scope-ids")
    ).toBeNull();
    expect(
      sessionStorage.getItem("flanksource-impersonated-scope-payload")
    ).toBeNull();
    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(SCOPE_IMPERSONATION_CHANGE_EVENT, handler);
  });
});

describe("hasImpersonatedScopes", () => {
  it("returns false when empty", () => {
    expect(hasImpersonatedScopes()).toBe(false);
  });

  it("returns true when scopes are set", () => {
    setImpersonatedScopes([makeScope()]);
    expect(hasImpersonatedScopes()).toBe(true);
  });
});

describe("getImpersonatedPayload", () => {
  it("returns null when nothing stored", () => {
    expect(getImpersonatedPayload()).toBeNull();
  });

  it("returns stored payload", () => {
    setImpersonatedScopes([
      makeScope({
        targets: [{ canary: { name: "c1" } }]
      })
    ]);
    const payload = getImpersonatedPayload();
    expect(payload?.canary).toEqual([{ names: ["c1"] }]);
  });
});

describe("buildPayload", () => {
  it("maps config target", () => {
    const payload = buildPayload([
      makeScope({
        targets: [
          { config: { name: "cfg", agent: "a1", tagSelector: "env=prod" } }
        ]
      })
    ]);
    expect(payload.config).toEqual([
      { names: ["cfg"], agents: ["a1"], tags: { env: "prod" } }
    ]);
  });

  it("maps component target", () => {
    const payload = buildPayload([
      makeScope({ targets: [{ component: { name: "comp" } }] })
    ]);
    expect(payload.component).toEqual([{ names: ["comp"] }]);
  });

  it("maps playbook target", () => {
    const payload = buildPayload([
      makeScope({ targets: [{ playbook: { name: "pb" } }] })
    ]);
    expect(payload.playbook).toEqual([{ names: ["pb"] }]);
  });

  it("maps canary target", () => {
    const payload = buildPayload([
      makeScope({ targets: [{ canary: { name: "cn", agent: "a2" } }] })
    ]);
    expect(payload.canary).toEqual([{ names: ["cn"], agents: ["a2"] }]);
  });

  it("maps view target", () => {
    const payload = buildPayload([
      makeScope({ targets: [{ view: { name: "v1" } }] })
    ]);
    expect(payload.view).toEqual([{ names: ["v1"] }]);
  });

  it("expands global to all resource types except playbook", () => {
    const payload = buildPayload([
      makeScope({ targets: [{ global: { name: "*" } }] })
    ]);
    expect(payload.config).toEqual([{ names: ["*"] }]);
    expect(payload.component).toEqual([{ names: ["*"] }]);
    expect(payload.canary).toEqual([{ names: ["*"] }]);
    expect(payload.view).toEqual([{ names: ["*"] }]);
    expect(payload.playbook).toBeUndefined();
  });

  it("aggregates targets from multiple scopes", () => {
    const payload = buildPayload([
      makeScope({
        id: "s1",
        targets: [{ config: { name: "c1" } }]
      }),
      makeScope({
        id: "s2",
        targets: [{ config: { name: "c2" } }]
      })
    ]);
    expect(payload.config).toEqual([{ names: ["c1"] }, { names: ["c2"] }]);
    expect(payload.scopes).toEqual(["s1", "s2"]);
  });

  it("parses multi-tag selectors", () => {
    const payload = buildPayload([
      makeScope({
        targets: [{ config: { name: "x", tagSelector: "env=prod,team=infra" } }]
      })
    ]);
    expect(payload.config![0].tags).toEqual({ env: "prod", team: "infra" });
  });

  it("omits empty fields from RLSScope", () => {
    const payload = buildPayload([
      makeScope({ targets: [{ config: { name: "x" } }] })
    ]);
    const scope = payload.config![0];
    expect(scope.agents).toBeUndefined();
    expect(scope.tags).toBeUndefined();
  });

  it("includes scope IDs", () => {
    const payload = buildPayload([
      makeScope({ id: "uuid-1" }),
      makeScope({ id: "uuid-2" })
    ]);
    expect(payload.scopes).toEqual(["uuid-1", "uuid-2"]);
  });
});
