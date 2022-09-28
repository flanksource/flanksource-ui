import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { User } from "./users";

export enum EvidenceType {
  Log = "log",
  Config = "config",
  Topology = "topology",
  Health = "health"
}

interface EvidenceBase {
  user: User;
  id: string;
  hypothesisId: string;
  description: string;
  properties: string;
  created_at: string;
  created_by: User;
}

type LogEvidenceAttachment = {
  type: EvidenceType.Log;
  evidence: {
    lines: {
      timestamp: string;
      message: string;
      labels: { [index: string]: string };
    }[];
  };
};

type ConfigEvidenceAttachment = {
  type: EvidenceType.Config;
  evidence: {
    id: string;
    lines: string[];
    configName: string;
    configType: string;
    selected_lines: { [index: string]: string };
  };
};

type TopologyEvidenceAttachment = {
  type: EvidenceType.Topology;
  evidence: {
    id: string;
  };
};

type HealthCheckEvidenceAttachment = {
  type: EvidenceType.Health;
  evidence: {
    check: string;
    includeMessages: boolean;
    start: string;
  };
};

export type EvidenceAttachment =
  | TopologyEvidenceAttachment
  | ConfigEvidenceAttachment
  | LogEvidenceAttachment
  | HealthCheckEvidenceAttachment;

type LogEvidence = LogEvidenceAttachment & EvidenceBase;
type ConfigEvidence = ConfigEvidenceAttachment & EvidenceBase;
type TopologyEvidence = TopologyEvidenceAttachment & EvidenceBase;
type HealthEvidence = HealthCheckEvidenceAttachment & EvidenceBase;

export type Evidence =
  | TopologyEvidence
  | ConfigEvidence
  | LogEvidence
  | HealthEvidence;

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
  const { user, id, hypothesisId, evidence, type, description, properties } =
    args;

  return resolve(
    IncidentCommander.post(`/evidences`, {
      id,
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
