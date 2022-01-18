import { apiRequestIC } from "../axios";
import { resolve } from "../resolve";

export const getAllIncident = async () =>
  resolve(apiRequestIC.get(`/incident`).then((res) => res.data));

export const getIncident = async (id) =>
  resolve(apiRequestIC.get(`/incident?id=eq.${id}`).then((res) => res.data));
