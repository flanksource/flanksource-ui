import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getCommentsByHypothesis = async (hypothesisId) =>
  resolve(
    IncidentCommander.get(
      `/comment?select=*,created_by(name)&hypothesis_id=eq.${hypothesisId}`
    )
  );

export const createComment = async (
  user,
  commentId,
  incidentId,
  hypothesisId,
  comment,
  params
) =>
  IncidentCommander.post(`/comment`, {
    id: commentId,
    created_by: user.id,
    incident_id: incidentId,
    hypothesis_id: hypothesisId,
    comment,
    ...params
  });
