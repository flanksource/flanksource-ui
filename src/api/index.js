import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_INCIDENT_COMMANDER_BASE_API;

export const axiosBaseConfigIncidentCommander = {
  baseURL: process.env.REACT_APP_INCIDENT_COMMANDER_BASE_API,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

export const apiRequestIC = axios.create(axiosBaseConfigIncidentCommander);
