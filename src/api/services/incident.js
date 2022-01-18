import { getUserID } from "../auth";
import { apiRequestIC } from "../axios";
import { resolve } from "../resolve";

export const getAllIncident = async () =>
  resolve(apiRequestIC.get(`/incident`).then((res) => res.data));

export const getAllIncidentByCurrentUser = async () =>
  resolve(
    apiRequestIC
      .get(`/incident?created_by=eq.${getUserID()}`)
      .then((res) => res.data)
  );

export const getIncident = async (id) =>
  resolve(apiRequestIC.get(`/incident?id=eq.${id}`).then((res) => res.data));

export const createIncident = async (params) =>
  resolve(apiRequestIC.post(`/incident`, params));
