import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { Team } from "./teams";
import { User } from "./users";

/**
 * column "id" {
    null    = false
    type    = uuid
    default = sql("generate_ulid()")
  }
  column "incident_id" {
    null = false
    type = uuid
  }
  column "type" {
    null = false
    type = text
  }
  column "index" {
    null = true
    type = smallint
  }
  column "person_id" {
    null = true
    type = uuid
  }
  column "team_id" {
    null = true
    type = uuid
  }
  column "external_id" {
    null = true
    type = text
  }
  column "properties" {
    null = true
    type = jsonb
  }
  column "acknowledged" {
    null = true
    type = timestamptz
  }
  column "resolved" {
    null = true
    type = timestamptz
  }
  column "closed" {
    null = true
    type = timestamptz
  }
  column "created_by" {
    null = false
    type = uuid
  }
  column "created_at" {
    null    = false
    type    = timestamptz
    default = sql("now()")
  }
  column "updated_at" {
    null    = false
    type    = timestamptz
    default = sql("now()")
  }
 */
export type Responder = {
  id: string;
  incident_id?: string;
  type: string;
  index?: number;
  person_id?: string;
  team_id?: string;
  external_id?: string;
  properties?: Record<string, any>;
  acknowledged?: string;
  resolved?: string;
  closed?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  person?: User;
  team?: Pick<Team, "id" | "name" | "icon" | "spec">;
};

export const getResponder = async (ids: string[]) =>
  resolve(IncidentCommander.get<Responder | null>(`/person?id=in.(${ids})`));

export const saveResponder = (
  params: Omit<Responder, "id" | "updated_at" | "created_at">
) => resolve(IncidentCommander.post<Responder>(`/responders?select=*`, params));

export const getRespondersForTheIncident = async (id: string) => {
  const res = await resolve(
    IncidentCommander.get<Responder[] | null>(
      `/responders?incident_id=eq.${id}&select=*,team:team_id(id,name,icon,spec),person:person_id(id,name,avatar)`
    )
  );
  return res.data ?? [];
};

export const deleteResponder = (id: string) =>
  resolve(IncidentCommander.delete(`/responders?id=eq.${id}`));
