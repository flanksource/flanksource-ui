import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";
import { User } from "./users";

export const getTeamMembers = (teamId: string) =>
  resolve<User[]>(
    IncidentCommander.get(
      `/team_members?team_id=eq.${teamId}&select=*,person_id(*)`
    ).then((response) => {
      return {
        data: response.data.map((item: any) => item.person_id)
      } as any;
    })
  );

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
