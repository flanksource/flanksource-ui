import { IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import { Comment, NewComment } from "../types/incident";

export const getCommentsByHypothesis = (hypothesisId: string) =>
  resolvePostGrestRequestWithPagination<Comment[]>(
    IncidentCommander.get(
      `/comments?select=*,created_by(id,name,avatar)&hypothesis_id=eq.${hypothesisId}&order=created_at.asc`
    )
  );

export const createComment = async ({
  user,
  incidentId,
  hypothesisId,
  comment
}: NewComment) =>
  resolvePostGrestRequestWithPagination<Comment>(
    IncidentCommander.post(`/comments`, {
      created_by: user.id,
      incident_id: incidentId,
      hypothesis_id: hypothesisId,
      comment
    })
  );
