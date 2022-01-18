import { getUserID } from "../auth";
import { apiRequestIC } from "../axios";
import { resolve } from "../resolve";

export const getAllHypothesisByIncident = async (incidentId) =>
  resolve(apiRequestIC.get(`/hypothesis?incident_id=eq.${incidentId}`));

export const getHypothesis = async (id) =>
  resolve(apiRequestIC.get(`/hypothesis?id=eq.${id}`).then((res) => res.data));

export const createHypothesis = async (id, incidentId, type, title, status) =>
  resolve(
    apiRequestIC.post(`/hypothesis`, {
      id,
      created_by: getUserID(),
      incident_id: incidentId,
      type,
      title,
      status
    })
  );

export const deleteHypothesis = async (id) =>
  resolve(apiRequestIC.delete(`/hypothesis?id=eq.${id}`).then((res) => res));
