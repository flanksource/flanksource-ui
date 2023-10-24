import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { Evidence } from "../types/evidence";
import {
  Hypothesis,
  HypothesisInfo,
  HypothesisStatus,
  NewHypothesis
} from "../types/hypothesis";
import { User } from "../types/users";
import { Comment } from "../types/incident";

export const getAllHypothesisByIncident = (incidentId: string) =>
  resolve<Hypothesis[]>(
    IncidentCommander.get(
      `/hypotheses?incident_id=eq.${incidentId}&order=created_at.asc`
    )
  );

export const getHypothesis = async (id: string) => {
  const comments = `comments!comments_incident_id_fkey(id,created_by(id,name,avatar))`;

  return resolve(
    IncidentCommander.get(`/hypotheses?id=eq.${id}&select(*,${comments})`)
  );
};

export const getHypothesisResponse = async (id: string) => {
  const comments =
    "comments(id,*,created_by(id,name,avatar),responder_id(*,team_id(*)))";
  const evidence = "evidences(id,*,created_by(id,name,avatar))";

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
      `/hypotheses?id=eq.${id}&select=id,${comments},${evidence}`
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
      `/hypotheses?order=created_at.desc&title=ilike.*${query}*&incident_id=eq.${incidentId}`
    )
  );

export const createHypothesis = async ({ user, ...params }: NewHypothesis) => {
  const { data, error } = await resolve<[Hypothesis]>(
    IncidentCommander.post(`/hypotheses`, {
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
    type: "root",
    title: "",
    status: HypothesisStatus.Possible
  }
) =>
  IncidentCommander.post(`/hypotheses`, {
    id,
    created_by: user.id,
    incident_id: incidentId,
    ...params
  });

export const updateHypothesis = (
  id: string,
  params: Partial<HypothesisInfo>
) => {
  return IncidentCommander.patch<Hypothesis[]>(`/hypotheses?id=eq.${id}`, {
    ...params
  });
};

// NOTE: Needs to be a database transaction. Possibility of partial deletes.
export const deleteHypothesis = async (id: string) => {
  await resolve(IncidentCommander.delete(`/comments?hypothesis_id=eq.${id}`));
  await resolve(IncidentCommander.delete(`/evidences?hypothesis_id=eq.${id}`));
  return resolve(IncidentCommander.delete(`/hypotheses?id=eq.${id}`));
};

export const deleteHypothesisBulk = async (idList: string[]) => {
  let ids = "";
  idList.forEach((id, index) => {
    ids += `"${id}"`;
    if (index < idList.length - 1) {
      ids += ",";
    }
  });
  return resolve(IncidentCommander.delete(`/hypotheses?id=in.(${ids})`));
};
