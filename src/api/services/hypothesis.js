import {
  hypothesisNodeTypes,
  hypothesisStatuses
} from "../../components/HypothesisBuilder/data";
import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getAllHypothesisByIncident = async (incidentId) =>
  resolve(
    IncidentCommander.get(
      `/hypothesis?incident_id=eq.${incidentId}&order=created_at.asc`
    )
  );

export const getHypothesis = async (id) =>
  resolve(IncidentCommander.get(`/hypothesis?id=eq.${id}`));

export const createHypothesis = async (
  user,
  id,
  incidentId,
  params = {
    type: hypothesisNodeTypes[0],
    title: "",
    status: hypothesisStatuses[2].value
  }
) =>
  IncidentCommander.post(`/hypothesis`, {
    id,
    created_by: user.id,
    incident_id: incidentId,
    ...params
  });

export const updateHypothesis = async (id, params) => {
  IncidentCommander.patch(`/hypothesis?id=eq.${id}`, { ...params });
};

export const deleteHypothesis = async (id) =>
  resolve(IncidentCommander.delete(`/hypothesis?id=eq.${id}`));

export const deleteHypothesisBulk = async (idList) => {
  let ids = "";
  idList.forEach((id, index) => {
    ids += `"${id}"`;
    if (index < idList.length - 1) {
      ids += ",";
    }
  });
  return resolve(IncidentCommander.delete(`/hypothesis?id=in.(${ids})`));
};
