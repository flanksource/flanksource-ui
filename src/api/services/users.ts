import { IncidentCommander } from "../axios";
import { resolve } from "../resolve";

interface NewUser {
  name: string;
  email: string;
  avatar?: string;
}

export interface User extends NewUser {
  id: string;
}

export const getPerson = async (id: string): Promise<{ data: User }> =>
  resolve(IncidentCommander.get(`/person?id=eq.${id}`));

export const getPersons = (): Promise<{ data: User[] }> =>
  resolve(IncidentCommander.get(`/person`));

export const getPersonWithEmail = (email: string): Promise<{ data: User }> =>
  resolve(IncidentCommander.get(`/person?email=eq.${email}`));

export const createPerson = ({
  name,
  email,
  avatar
}: NewUser): Promise<{ data: User }> =>
  resolve(IncidentCommander.post("/person", { name, email, avatar }));
