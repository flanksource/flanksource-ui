import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { NewComment } from "../types/incident";
import { Comment } from "../types/incident";

export const getCommentsByHypothesis = (hypothesisId: string) =>
  resolve<Comment[]>(
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
  resolve<Comment>(
    IncidentCommander.post(`/comments`, {
      created_by: user.id,
      incident_id: incidentId,
      hypothesis_id: hypothesisId,
      comment
    })
  );
