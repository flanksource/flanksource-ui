import { User } from "../auth";
import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

const evidenceTypes = ["log"];

export const getAllEvidenceByHypothesis = async (hypothesisId) =>
  resolve(IncidentCommander.get(`/evidence?hypothesis_id=eq.${hypothesisId}`));

export const getEvidence = async (id) =>
  resolve(IncidentCommander.get(`/evidence?id=eq.${id}`));

export const createEvidence = async (
  id,
  hypothesisId,
  evidence,
  params = {
    type: evidenceTypes[0],
    description: "",
    properties: ""
  }
) =>
  resolve(
    IncidentCommander.post(`/evidence`, {
      id,
      created_by: User.id,
      hypothesis_id: hypothesisId,
      evidence,
      ...params
    })
  );

export const updateEvidence = async (id, params) => {
  resolve(IncidentCommander.patch(`/evidence?id=eq.${id}`, { ...params }));
};

export const deleteEvidence = async (id) =>
  resolve(IncidentCommander.delete(`/evidence?id=eq.${id}`));

export const deleteEvidenceBulk = async (idList) => {
  let ids = "";
  idList.forEach((id, index) => {
    ids += `"${id}"`;
    if (index < idList.length - 1) {
      ids += ",";
    }
  });
  return resolve(IncidentCommander.delete(`/evidence?id=in.(${ids})`));
};
