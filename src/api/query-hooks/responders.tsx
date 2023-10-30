import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../services/teams";
import { Team, User } from "../types/users";
import { getPersons } from "../services/users";

export function useGetAllTeams() {
  return useQuery<Team[], Error>(["teams", "all"], () => getTeams());
}

export function useGetAllPeople() {
  return useQuery<User[], Error>(["people", "all"], async () => {
    const people = await getPersons();
    return people.data ?? [];
  });
}
