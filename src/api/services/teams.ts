import { IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
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

export const addUserToTeam = (teamId: string, userIds: string[]) => {
  const payload = userIds.map((userId) => {
    return {
      team_id: teamId,
      person_id: userId
    };
  });
  return resolvePostGrestRequestWithPagination(
    IncidentCommander.post(`/team_members`, payload)
  );
};

export const removeUserFromTeam = (teamId: string, userId: string) => {
  return resolvePostGrestRequestWithPagination(
    IncidentCommander.delete(
      `/team_members?team_id=eq.${teamId}&person_id=eq.${userId}`
    )
  );
};
