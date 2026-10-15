// ABOUTME: Reads and records the checklist actions the signed-in user has completed (person_analytics).
// ABOUTME: The server records each action as the signed-in user's and counts repeats.
import { People } from "../axios";

export type PersonTouchpoint = {
  key: string;
  count: number;
  created_at: string;
  updated_at: string;
};

type PersonTouchpointsResponse = {
  payload?: PersonTouchpoint[];
};

export async function fetchPersonTouchpoints(): Promise<PersonTouchpoint[]> {
  const response = await People.get<PersonTouchpointsResponse>("/analytics");
  return response.data.payload ?? [];
}

export function recordPersonTouchpoint(key: string) {
  return People.post("/analytics", { key });
}
