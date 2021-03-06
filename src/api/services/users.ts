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

export const getPerson = (id: string) =>
  resolve<User>(IncidentCommander.get(`/people?id=eq.${id}`));

export const getPersons = () =>
  resolve<User[]>(IncidentCommander.get(`/people`));

export const getPersonWithEmail = (email: string) =>
  resolve<User>(IncidentCommander.get(`/people?email=eq.${email}`));

export const createPerson = ({ name, email, avatar }: NewUser) =>
  resolve<User>(IncidentCommander.post("/people", { name, email, avatar }));
