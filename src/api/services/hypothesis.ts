import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { Comment } from "./comments";
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
  created_by?: User;
  parent_id?: string;
  evidence?: Evidence[];
  comment?: any[];
  id: string;
  incident_id: string;
  type: HypothesisNodeType;
}

export const getAllHypothesisByIncident = (incidentId: string) =>
  resolve<Hypothesis[]>(
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

export const getHypothesisResponse = async (id: string) => {
  const comments = "comment(id,*,created_by(id,name,avatar))";
  const evidence = "evidence(id,*,created_by(id,name,avatar))";

  const { data, error } = await resolve<
    [
      {
        id: string;
        comment: Comment[];
        evidence: Evidence[];
      }
    ]
  >(
    IncidentCommander.get(
      `/hypothesis?id=eq.${id}&select=id,${comments},${evidence}`
    )
  );

  if (error) {
    return { error, data: null };
  }

  return { data: data && data[0], error };
};

export const searchHypothesis = (incidentId: string, query: string) =>
  resolve<Hypothesis[]>(
    IncidentCommander.get(
      `/hypothesis?order=created_at.desc&title=ilike.*${query}*&incident_id=eq.${incidentId}`
    )
  );

interface HypothesisInfo {
  type: HypothesisNodeType;
  title: string;
  status: HypothesisStatus;
}

interface NewBaseHypothesis {
  user: User;
  incident_id: string;
  title?: string;
  status: HypothesisStatus;
}

type NewRootNode = {
  type: HypothesisNodeType.Root;
} & NewBaseHypothesis;

type NewChildNode = {
  type: HypothesisNodeType.Factor | HypothesisNodeType.Solution;
  parent_id?: string;
} & NewBaseHypothesis;

type NewHypothesis = NewRootNode | NewChildNode;

export const createHypothesis = async ({ user, ...params }: NewHypothesis) => {
  const { data, error } = await resolve<[Hypothesis]>(
    IncidentCommander.post(`/hypothesis`, {
      ...params,
      created_by: user.id
    })
  );
  if (error) {
    return { error, data: null };
  }

  return { data: data && data[0], error };
};

export const createHypothesisOld = async (
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
