import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { Evidence } from "./evidence";
import { User } from "./users";

export enum HypothesisNodeType {
  Root = "root",
  Factor = "factor",
  Solution = "solution"
}

export enum HypothesisStatus {
  Proven = "proven",
  Likely = "likely",
  Possible = "possible",
  Unlikely = "unlikely",
  Improbable = "improbable",
  Disproven = "disproven"
}

export interface Hypothesis {
  title: string;
  status: HypothesisStatus;
  created_by: User;
  evidence?: Evidence[];
  comment?: any[];
  id: string;
  incident_id: string;
  type: HypothesisNodeType;
}

export const getAllHypothesisByIncident = async (incidentId: string) =>
  resolve(
    IncidentCommander.get(
      `/hypothesis?incident_id=eq.${incidentId}&order=created_at.asc`
    )
  );

export const getHypothesis = async (id: string) => {
  const comments = `comment!comment_incident_id_fkey(id,created_by(id,name,avatar))`;

  return resolve(
    IncidentCommander.get(`/hypothesis?id=eq.${id}&select(*,${comments})`)
  );
};

interface HypothesisInfo {
  type: HypothesisNodeType;
  title: string;
  status: HypothesisStatus;
}

export const createHypothesis = async (
  user: User,
  id: string,
  incidentId: string,
  params: HypothesisInfo = {
    type: HypothesisNodeType.Root,
    title: "",
    status: HypothesisStatus.Possible
  }
) =>
  IncidentCommander.post(`/hypothesis`, {
    id,
    created_by: user.id,
    incident_id: incidentId,
    ...params
  });

export const updateHypothesis = async (id: string, params: HypothesisInfo) => {
  IncidentCommander.patch(`/hypothesis?id=eq.${id}`, { ...params });
};

// NOTE: Needs to be a database transaction. Possibility of partial deletes.
export const deleteHypothesis = async (id: string) => {
  await resolve(IncidentCommander.delete(`/comment?hypothesis_id=eq.${id}`));
  await resolve(IncidentCommander.delete(`/evidence?hypothesis_id=eq.${id}`));
  return resolve(IncidentCommander.delete(`/hypothesis?id=eq.${id}`));
};

export const deleteHypothesisBulk = async (idList: string[]) => {
  let ids = "";
  idList.forEach((id, index) => {
    ids += `"${id}"`;
    if (index < idList.length - 1) {
      ids += ",";
    }
  });
  return resolve(IncidentCommander.delete(`/hypothesis?id=in.(${ids})`));
};
