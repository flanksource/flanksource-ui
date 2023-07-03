import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { User } from "./users";

export type Team = {
  id: string;
  name: string;
  icon: string;
  spec: Record<string, any>;
  source?: string;
  created_by?: User;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export const getTeam = async (id: string): Promise<Team | undefined> => {
  const response = await IncidentCommander.get<Team | null>(
    `/teams?id=eq.${id}`
  );
  const data = response.data;
  return data || undefined;
};

export const getTeams = async (): Promise<Team[]> => {
  const response = await IncidentCommander.get<Team[] | null>(
    `/teams?deleted_at=is.null`
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
  return resolve(IncidentCommander.post(`/team_members`, payload));
};

export const removeUserFromTeam = (userId: string) => {
  return resolve(
    IncidentCommander.delete(`/team_members?person_id=eq.${userId}`)
  );
};
