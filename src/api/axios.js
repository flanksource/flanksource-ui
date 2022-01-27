import axios from "axios";

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

CanaryChecker.interceptors.request.use(
  (config) => {
    console.log(config.method, config.url, config);
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

CanaryChecker.interceptors.response.use(
  (response) => {
    console.log(response.status, response);
    return response;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);
