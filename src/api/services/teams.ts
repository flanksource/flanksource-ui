import { apiBase, IncidentCommander } from "../axios";
import { Team, User } from "../types/users";

export const getTeam = async (id: string): Promise<Team | null> => {
  const response = await IncidentCommander.get<Team | null>(
    `/teams?id=eq.${id}`
  );
  const data = response.data;
  return data || null;
};

export const getTeams = async (): Promise<Team[]> => {
  const response = await IncidentCommander.get<Team[] | null>(
    `/teams?deleted_at=is.null&order=name.asc`
  );
  const data = response.data;
  return data || [];
};

export type TeamMember = User & {
  // Where the membership came from, e.g. "UI", "KubernetesCRD" or "team-mapper"
  source?: string;
};

export const getTeamMembers = async (
  teamId: string
): Promise<{ data: TeamMember[] }> => {
  const response = await IncidentCommander.get<
    { person_id: User; source?: string }[]
  >(`/team_members?team_id=eq.${teamId}&select=source,person_id(*)`);
  const data = response.data.map(({ person_id, source }) => ({
    ...person_id,
    source
  }));
  return { data };
};

// Members are written through /teams/:id/members, which only accepts people who can be team members; /db/team_members is read-only
export const addUserToTeam = (teamId: string, personIds: string[]) =>
  apiBase.post(`/teams/${teamId}/members`, { personIds });

export const removeUserFromTeam = (teamId: string, personId: string) =>
  apiBase.delete(`/teams/${teamId}/members/${personId}`);
