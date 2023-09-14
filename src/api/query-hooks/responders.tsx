import { useQuery } from "@tanstack/react-query";
import { Team, getTeams } from "../services/teams";
import { User, getPersons } from "../services/users";

export function useGetAllTeams() {
  return useQuery<Team[], Error>(["teams", "all"], () => getTeams());
}

export function useGetAllPeople() {
  return useQuery<User[], Error>(["people", "all"], async () => {
    const people = await getPersons();
    return people.data ?? [];
  });
}
