import {
  hypothesisNodeTypes,
  hypothesisStatuses
} from "../../components/HypothesisBuilder/data";
import { getUserID } from "../auth";
import { apiRequestIC } from "../axios";
import { resolve } from "../resolve";

export const getAllHypothesisByIncident = async (incidentId) =>
  resolve(apiRequestIC.get(`/hypothesis?incident_id=eq.${incidentId}`));

export const getHypothesis = async (id) =>
  resolve(apiRequestIC.get(`/hypothesis?id=eq.${id}`).then((res) => res.data));

export const createHypothesis = async (
  id,
  incidentId,
  params = {
    type: hypothesisNodeTypes[0],
    title: "",
    status: hypothesisStatuses[2].value
  }
) =>
  resolve(
    apiRequestIC.post(`/hypothesis`, {
      id,
      created_by: getUserID(),
      incident_id: incidentId,
      ...params
    })
  );

export const updateHypothesis = async (id, params) => {
  resolve(apiRequestIC.patch(`/hypothesis?id=eq.${id}`, { ...params }));
};
export const deleteHypothesis = async (id) =>
  resolve(apiRequestIC.delete(`/hypothesis?id=eq.${id}`).then((res) => res));

export const deleteHypothesisBulk = async (idList) => {
  let ids = "";
  idList.forEach((id, index) => {
    ids += `"${id}"`;
    if (index < idList.length - 1) {
      ids += ",";
    }
  });
  return resolve(
    apiRequestIC.delete(`/hypothesis?id=in.(${ids})`).then((res) => res)
  );
};
