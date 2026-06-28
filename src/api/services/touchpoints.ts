// ABOUTME: Reads and records person_touchpoints — the checklist actions a user has completed.
// ABOUTME: Upserts on (person_id, key) via merge-duplicates so re-doing an action is idempotent.
import { IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";

export type PersonTouchpoint = {
  person_id: string;
  key: string;
};

export function fetchPersonTouchpoints(personId: string) {
  return resolvePostGrestRequestWithPagination<Pick<PersonTouchpoint, "key">[]>(
    IncidentCommander.get(
      `/person_touchpoints?person_id=eq.${personId}&select=key`
    )
  );
}

export function recordPersonTouchpoint(personId: string, key: string) {
  return IncidentCommander.post(
    "/person_touchpoints",
    { person_id: personId, key },
    { headers: { Prefer: "resolution=merge-duplicates,return=minimal" } }
  );
}
