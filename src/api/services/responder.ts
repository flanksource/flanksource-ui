import { IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import { Responder } from "../types/incident";

export const getResponder = async (ids: string[]) =>
  resolvePostGrestRequestWithPagination(
    IncidentCommander.get<Responder | null>(`/person?id=in.(${ids})`)
  );

export const saveResponder = (
  params: Omit<Responder, "id" | "created_at" | "updated_at">
) =>
  resolvePostGrestRequestWithPagination(
    IncidentCommander.post<Responder>(`/responders?select=*`, params)
  );

export const getRespondersForTheIncident = async (id: string) => {
  const res = await resolvePostGrestRequestWithPagination(
    IncidentCommander.get<Responder[] | null>(
      `/responders?incident_id=eq.${id}&select=*,team:team_id(id,name,icon,spec),person:person_id(id,name,avatar)&deleted_at=is.null`
    )
  );
  return res.data ?? [];
};

export const deleteResponder = (id: string) => {
  return IncidentCommander.patch<Responder | null>(`/responders?id=eq.${id}`, {
    deleted_at: "now()"
  });
};
