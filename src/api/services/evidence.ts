import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { User } from "./users";

export enum EvidenceType {
  Log = "log",
  Config = "config",
  Topology = "topology",
  Check = "check",
  ConfigAnalysis = "config_analysis",
  ConfigChange = "config_change"
}

export type Evidence = {
  user: User;
  id: string;
  hypothesisId: string;
  component_id: string;
  config_id: string;
  config_analysis_id: string;
  config_change_id: string;
  check_id: string;
  evidence: object;
  description: string;
  properties: string;
  created_at: string;
  created_by: User;
  type: EvidenceType;
};

export const getAllEvidenceByHypothesis = async (hypothesisId: string) => {
  const { data, error } = await resolve<Evidence[]>(
    IncidentCommander.get(
      `/evidences?hypothesis_id=eq.${hypothesisId}&select=*,created_by(id,name,avatar)`
    )
  );
  if (error) {
    return { error };
  }

  return { data };
};

export const getEvidence = async (id: string) =>
  resolve(IncidentCommander.get(`/evidences?id=eq.${id}`));

export const createEvidence = async (args: Evidence) => {
  const {
    user,
    id,
    hypothesisId,
    evidence,
    config_id,
    config_change_id,
    config_analysis_id,
    component_id,
    check_id,
    type,
    description,
    properties
  } = args;

  return resolve(
    IncidentCommander.post(`/evidences`, {
      id,
      config_id,
      config_analysis_id,
      config_change_id,
      component_id,
      check_id,
      created_by: user.id,
      hypothesis_id: hypothesisId,
      evidence,
      type,
      description,
      properties
    })
  );
};

export const updateEvidence = async (id: string, params: {}) =>
  resolve(IncidentCommander.patch(`/evidences?id=eq.${id}`, { ...params }));

export const deleteEvidence = async (id: string) =>
  resolve(IncidentCommander.delete(`/evidences?id=eq.${id}`));

export const deleteEvidenceBulk = async (idList: string[]) => {
  let ids = "";
  idList.forEach((id, index) => {
    ids += `"${id}"`;
    if (index < idList.length - 1) {
      ids += ",";
    }
  });
  return resolve(IncidentCommander.delete(`/evidences?id=in.(${ids})`));
};
