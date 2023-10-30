import { CreatedAt, Avatar, UpdatedAt } from "../traits";
import { EvidenceWithEvidenceItems } from "./evidence";
import { Hypothesis } from "./hypothesis";
import { Team, User } from "./users";

export const IncidentPriority = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
  Critical: "Critical",
  Blocker: "Blocker"
};

export const enum IncidentSeverity {
  Low = "low",
  Medium = "medium",
  High = "high",
  Blocker = "blocker",
  Critical = "critical"
}

export type IncidentType =
  | "cost"
  | "availability"
  | "performance"
  | "security"
  | "integration"
  | "technicalDebt"
  | "reliability"
  | "compliance";

// expand this list to add more items
export enum IncidentHistoryType {
  "incident.created" = "incident.created",
  "responder.created" = "responder.created",
  "evidence.created" = "evidence.created",
  "incident.status_updated" = "incident.status_updated",
  "evidence.done_definition_added" = "evidence.done_definition_added",
  "incident_status.updated" = "incident_status.updated",
  "responder.commented" = "responder.commented",
  "hypothesis.created" = "hypothesis.created",
  "hypothesis.status_updated" = "hypothesis.status_updated"
}

export enum IncidentStatus {
  "New" = "new",
  Open = "open",
  Investigating = "investigating",
  Mitigated = "mitigated",
  Resolved = "resolved",
  Closed = "closed"
}

export interface NewIncident {
  title: string;
  description: string;
  severity: IncidentSeverity | string;
  type?: string;
  status?: IncidentStatus;
  commander_id: {
    id?: string;
    name?: string;
    avatar?: string;
  };
  communicator_id: string;
}

export interface Incident extends NewIncident, CreatedAt {
  id: string;
  incident_id: string;
  created_by: string;
  parent_id: string;
  hypotheses: Hypothesis[];
  involved: User[];
  commander: User;
}

export interface Comment extends UpdatedAt, CreatedAt, Avatar {
  id: string;
  comment: string;
  external_id?: string;
  incident_id: string;
  responder_id?: string;
  hypothesis_id?: string;
  read?: string;
  external_created_by?: string;
}

export interface NewComment {
  user: User;
  incidentId: string;
  hypothesisId: string;
  comment: string;
}

export interface IncidentSummary extends CreatedAt, UpdatedAt {
  id: string;
  incident_id: string;
  title: string;
  severity: IncidentSeverity;
  type: IncidentType;
  status: IncidentStatus;
  commander?: User;
  responders?: User[];
  commenters?: User[];
}

export interface IncidentHistory extends Avatar {
  id: string;
  incident_id: string;
  type: IncidentHistoryType;
  description: string;
  hypothesis_id?: string;
  created_at: string;
  updated_at: string;
  hypotheses?: Hypothesis[];
  incident?: Incident;
  evidence?: EvidenceWithEvidenceItems;
  hypothesis?: Hypothesis;
  responder?: Responder;
  comment?: Comment;
}

export interface Responder extends UpdatedAt, CreatedAt {
  id: string;
  incident_id: string;
  type: string;
  index?: number;
  person_id?: string;
  person?: Pick<User, "id" | "name" | "avatar">;
  team_id?: string;
  team?: Pick<Team, "id" | "name" | "icon" | "spec">;
  external_id?: string;
  created_by?: string;
  properties?: Record<string, any>;
  acknowledged?: string;
  resolved?: string;
  closed?: string;
}

export type NewResponder = Omit<
  Responder,
  "id" | "updated_at" | "created_at" | "created_by"
> & { created_by: string };
