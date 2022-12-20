import { IncidentCommander } from "../axios";
import { Evidence } from "./evidence";
import { Hypothesis } from "./hypothesis";
import { Incident } from "./incident";
import { User } from "./users";

// expand this list to add more items
export enum IncidentHistoryType {
  "incident.created" = "incident.created",
  "responder.created" = "responder.created",
  "evidence.created" = "evidence.created",
  "incident.status_updated" = "incident.status_updated",
  "incident_status.updated" = "incident_status.updated",
  "responder.commented" = "responder.commented",
  "hypothesis.created" = "hypothesis.created",
  "hypothesis.status_updated" = "hypothesis.status_updated"
}

export interface Comment {
  id: string;
  created_by: Pick<User, "id" | "name" | "avatar">;
  comment: string;
  external_id?: string;
  incident_id?: string;
  responder_id?: string;
  hypothesis_id?: string;
  read?: string;
  updated_at?: string;
  external_created_by?: string;
}

export interface Responder {
  id: string;
  incident_id: string;
  type: string;
  index: number;
  person_id: string;
  person?: Pick<User, "id" | "name" | "avatar">;
  team_id?: string;
  external_id?: string;
  properties?: Record<string, any>;
  acknowledged?: string;
  resolved?: string;
  closed?: string;
  created_by: Pick<User, "id" | "name" | "avatar">;
  created_at: string;
  updated_at: string;
}

export interface IncidentHistory {
  id: string;
  incident_id: string;
  created_by: Pick<User, "id" | "name" | "avatar">;
  type: IncidentHistoryType;
  description: string;
  hypothesis_id?: string;
  created_at: string;
  updated_at: string;
  hypotheses?: Hypothesis[];
  incident?: Incident;
  evidence?: Evidence;
  hypothesis?: Hypothesis;
  responder?: Responder;
  comment?: Comment;
}

export const getIncidentHistory = async (incidentID: string) => {
  const res = await IncidentCommander.get<IncidentHistory[]>(
    `/incident_histories?incident_id=eq.${incidentID}&select=*,evidence:evidences(id,description),hypothesis:hypotheses(id,title),responder:responders(id,person:person_id(id,name,avatar)),comment:comments(id,comment),created_by(id,name,avatar))&order=created_at.desc`
  );
  return res.data;
};
