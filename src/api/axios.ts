import { toastError } from "@flanksource-ui/components/Toast/toast";
import { isCanaryUI } from "@flanksource-ui/context/Environment";
import axios, { AxiosError } from "axios";

const isClerkAuthSystem = !!process.env.NEXT_PUBLIC_AUTH_IS_CLERK === true;

const API_BASE = "/api";

export const apiBase = axios.create({
  baseURL: `${API_BASE}`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const IncidentCommander = axios.create({
  baseURL: `${API_BASE}/db`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const ConfigDB = axios.create({
  baseURL: `${API_BASE}/db`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const Logs = axios.create({
  baseURL: `${API_BASE}/apm/search`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

let canaryBaseUrl = "/canary";

export const CanaryCheckerDB = axios.create({
  baseURL: `${API_BASE}/db`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const CanaryChecker = axios.create({
  baseURL: `${API_BASE}${canaryBaseUrl}`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const Config = axios.create({
  baseURL: `${API_BASE}/config`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const Catalog = axios.create({
  baseURL: `${API_BASE}/catalog`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const Snapshot = axios.create({
  baseURL: `${API_BASE}/snapshot`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json",
    responseType: "blob"
  }
});

export const AgentAPI = axios.create({
  baseURL: `${API_BASE}/agent`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json",
    responseType: "blob"
  }
});

export const LogsSearch = axios.create({
  baseURL: `${API_BASE}/logs`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const Auth = axios.create({
  baseURL: `${API_BASE}/auth`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const PlaybookAPI = axios.create({
  baseURL: `${API_BASE}/playbook`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const Rback = axios.create({
  baseURL: `${API_BASE}/rbac`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

for (const client of [
  Auth,
  IncidentCommander,
  Logs,
  CanaryChecker,
  Config,
  ConfigDB,
  Rback,
  Snapshot
]) {
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // For canary UI, we don't have an auth system in place
      if (!isCanaryUI) {
        redirectToLoginPageOnSessionExpiry(error);
      }
      if ("code" in (error as any)) {
        // Show a toast message for timeout and network errors
        if (error.code === "ECONNABORTED") {
          toastError("Request timed out. Please try again.");
          return;
        }
        if (error.code === "ERR_NETWORK") {
          toastError("Network Error. Please try again.");
          return;
        }
        if (error.code === "ERR_INTERNET_DISCONNECTED") {
          toastError("No internet connection. Please try again.");
          return;
        }
      }
      return Promise.reject(error);
    }
  );
}

export function redirectToLoginPageOnSessionExpiry(error: AxiosError) {
  if (error?.response?.status === 401) {
    if (isClerkAuthSystem) {
      const url = `/auth-state-checker?return_to=${window.location.pathname}${window.location.search}`;
      window.location.href = url;
      return;
    }

    const url = `/login?return_to=${window.location.pathname}${window.location.search}`;
    window.location.href = url;
  }
}
