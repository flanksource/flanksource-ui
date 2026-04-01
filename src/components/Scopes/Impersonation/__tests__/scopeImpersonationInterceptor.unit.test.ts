// ABOUTME: Tests that the axios interceptor attaches X-Flanksource-Scope header.
// ABOUTME: Validates header contains the resolved RLS payload format.

import { IncidentCommander, Config, Catalog } from "@flanksource-ui/api/axios";
import { ScopeDB } from "@flanksource-ui/api/types/scopes";
import {
  clearImpersonatedScopes,
  setImpersonatedScopes
} from "../scopeImpersonationStore";
import { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

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

// Run a request config through an axios instance's request interceptors
// without actually making an HTTP request
function runRequestInterceptors(
  instance: typeof IncidentCommander
): InternalAxiosRequestConfig {
  const handlers = (instance.interceptors.request as any).handlers as Array<{
    fulfilled: (
      config: InternalAxiosRequestConfig
    ) => InternalAxiosRequestConfig;
  }>;

  let config: InternalAxiosRequestConfig = {
    headers: new AxiosHeaders()
  };

  for (const handler of handlers) {
    if (handler.fulfilled) {
      config = handler.fulfilled(config);
    }
  }

  return config;
}

describe("scope impersonation interceptor", () => {
  it("does not add header when no scopes are set", () => {
    const config = runRequestInterceptors(IncidentCommander);
    expect(config.headers["X-Flanksource-Scope"]).toBeUndefined();
  });

  it("adds header with resolved payload when scopes are set", () => {
    const scope = makeScope({
      id: "uuid-1",
      targets: [{ config: { name: "my-cfg", agent: "a1" } }]
    });
    setImpersonatedScopes([scope]);

    const config = runRequestInterceptors(IncidentCommander);
    const header = JSON.parse(config.headers["X-Flanksource-Scope"] as string);
    expect(header.config).toEqual([{ names: ["my-cfg"], agents: ["a1"] }]);
    expect(header.scopes).toEqual(["uuid-1"]);
  });

  it("applies to multiple axios instances", () => {
    setImpersonatedScopes([makeScope({ id: "uuid-1" })]);

    for (const instance of [IncidentCommander, Config, Catalog]) {
      const config = runRequestInterceptors(instance);
      const header = JSON.parse(
        config.headers["X-Flanksource-Scope"] as string
      );
      expect(header.scopes).toEqual(["uuid-1"]);
    }
  });

  it("removes header after clearing scopes", () => {
    setImpersonatedScopes([makeScope()]);
    clearImpersonatedScopes();

    const config = runRequestInterceptors(IncidentCommander);
    expect(config.headers["X-Flanksource-Scope"]).toBeUndefined();
  });
});
