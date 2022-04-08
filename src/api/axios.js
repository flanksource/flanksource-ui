import axios from "axios";

import { toastError } from "../components/Toast/toast";

export const IncidentCommander = axios.create({
  baseURL: "/db",
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const Logs = axios.create({
  baseURL: "/apm/search",
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const CanaryChecker = axios.create({
  baseURL: "/canary",
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

export const Config = axios.create({
  baseURL: "/config",
  headers: {
    Accept: "application/json",
    Prefer: "return=representation",
    "Content-Type": "application/json"
  }
});

for (const client of [IncidentCommander, Logs, CanaryChecker, Config]) {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      toastError(error.response.data.message);
      return Promise.reject(error);
    }
  );
}
