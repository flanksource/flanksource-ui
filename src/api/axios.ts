import axios, { AxiosError } from "axios";

import { toastError } from "../components/Toast/toast";

const API_BASE = "/api";

export const IncidentCommander = axios.create({
  baseURL: `${API_BASE}/db`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const JSONSchema = axios.create({
  baseURL: `${API_BASE}`,
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

export const Snapshot = axios.create({
  baseURL: `${API_BASE}/snapshot`,
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
    (response) => response,
    (error) => {
      redirectToLoginPageOnSessionExpiry(error);
      toastError(error.response.data.message);
      return Promise.reject(error);
    }
  );
}

function redirectToLoginPageOnSessionExpiry(error: AxiosError) {
  if (error?.response?.status === 401) {
    const url = `/login?return_to=${window.location.pathname}${window.location.search}`;
    window.location.href = url;
  }
}
