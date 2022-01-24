import { User } from "../auth";
import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

export const getCommentsByHypothesis = async (hypothesisId) =>
  resolve(
    IncidentCommander.get(
      `/comment?select=*,created_by(name)&hypothesis_id=eq.${hypothesisId}`
    )
  );

export const createComment = async (
  commentId,
  incidentId,
  hypothesisId,
  comment,
  params
) =>
  resolve(
    IncidentCommander.post(`/comment`, {
      id: commentId,
      created_by: User.id,
      incident_id: incidentId,
      hypothesis_id: hypothesisId,
      comment,
      ...params
    })
  );
