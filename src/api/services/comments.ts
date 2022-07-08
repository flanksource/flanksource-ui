import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { User } from "./users";

interface NewComment {
  user: User;
  incidentId: string;
  hypothesisId: string;
  comment: string;
}

export interface Comment {
  id: string;
  created_by: User;
  incident_id: string;
  hypothesis_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

export const getCommentsByHypothesis = (hypothesisId: string) =>
  resolve<Comment[]>(
    IncidentCommander.get(
      `/comment?select=*,created_by(id,name,avatar)&hypothesis_id=eq.${hypothesisId}&order=created_at.asc`
    )
  );

export const createComment = async ({
  user,
  incidentId,
  hypothesisId,
  comment
}: NewComment) =>
  resolve<Comment>(
    IncidentCommander.post(`/comment`, {
      created_by: user.id,
      incident_id: incidentId,
      hypothesis_id: hypothesisId,
      comment
    })
  );
