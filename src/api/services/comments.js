import { getUserID } from "../auth";
import { apiRequestIC } from "../axios";
import { resolve } from "../resolve";

export const getCommentsByHypothesis = async (hypothesisId) =>
  resolve(
    apiRequestIC.get(
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
    apiRequestIC.post(`/comment`, {
      id: commentId,
      created_by: getUserID(),
      incident_id: incidentId,
      hypothesis_id: hypothesisId,
      comment,
      ...params
    })
  );
