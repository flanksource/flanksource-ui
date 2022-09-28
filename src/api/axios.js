import axios from "axios";

import { toastError } from "../components/Toast/toast";

const API_BASE = "/api";

export const IncidentCommander = axios.create({
  baseURL: `${API_BASE}/incidents_db`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const ConfigDB = axios.create({
  baseURL: `${API_BASE}/configs_db`,
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
  baseURL: `${API_BASE}${canaryBaseUrl}/db`,
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
  baseURL: `${API_BASE}/configs_db`,
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

for (const client of [
  IncidentCommander,
  Logs,
  CanaryChecker,
  Config,
  ConfigDB
]) {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      toastError(error.response.data.message);
      return Promise.reject(error);
    }
  );
}
