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

export const getTeamMembers = async (
  teamId: string
): Promise<{ data: User[] }> => {
  const response = await IncidentCommander.get<{ person_id: User }[]>(
    `/team_members?team_id=eq.${teamId}&select=*,person_id(*)`
  );
  const data: User[] = response.data.map(({ person_id }) => person_id);
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

export const removeUserFromTeam = (userId: string) => {
  return resolvePostGrestRequestWithPagination(
    IncidentCommander.delete(`/team_members?person_id=eq.${userId}`)
  );
};
