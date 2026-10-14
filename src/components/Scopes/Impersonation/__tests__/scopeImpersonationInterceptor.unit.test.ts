// ABOUTME: Tests that the axios interceptor attaches X-Flanksource-Scope header.
// ABOUTME: Validates header contains a JSON array of Scope IDs.

import { IncidentCommander, Config, Catalog } from "@flanksource-ui/api/axios";
import {
  clearImpersonatedScopes,
  setImpersonatedScopes
} from "../scopeImpersonationStore";
import { AxiosHeaders, InternalAxiosRequestConfig } from "axios";

beforeEach(() => {
  sessionStorage.clear();
});

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

  it("adds header with Scope IDs when scopes are set", () => {
    setImpersonatedScopes(["uuid-1", "uuid-2"]);

    const config = runRequestInterceptors(IncidentCommander);
    const header = JSON.parse(config.headers["X-Flanksource-Scope"] as string);
    expect(header).toEqual(["uuid-1", "uuid-2"]);
  });

  it("applies to multiple axios instances", () => {
    setImpersonatedScopes(["uuid-1"]);

    for (const instance of [IncidentCommander, Config, Catalog]) {
      const config = runRequestInterceptors(instance);
      const header = JSON.parse(
        config.headers["X-Flanksource-Scope"] as string
      );
      expect(header).toEqual(["uuid-1"]);
    }
  });

  it("removes header after clearing scopes", () => {
    setImpersonatedScopes(["scope-1"]);
    clearImpersonatedScopes();

    const config = runRequestInterceptors(IncidentCommander);
    expect(config.headers["X-Flanksource-Scope"]).toBeUndefined();
  });
});
