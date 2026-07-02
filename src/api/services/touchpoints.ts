// ABOUTME: Reads and records person_analytics — the checklist actions a user has completed.
// ABOUTME: A person_analytics trigger counts repeats, so recording an action is a plain insert.
import { IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";

export type PersonTouchpoint = {
  person_id: string;
  key: string;
};

export function fetchPersonTouchpoints(personId: string) {
  return resolvePostGrestRequestWithPagination<Pick<PersonTouchpoint, "key">[]>(
    IncidentCommander.get(
      `/person_analytics?person_id=eq.${personId}&select=key`
    )
  );
}

export function recordPersonTouchpoint(personId: string, key: string) {
  return IncidentCommander.post(
    "/person_analytics",
    { person_id: personId, key },
    { headers: { Prefer: "return=minimal" } }
  );
}
