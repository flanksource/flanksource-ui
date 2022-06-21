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
  resolve<User>(IncidentCommander.get(`/person?id=eq.${id}`));

export const getPersons = () =>
  resolve<User[]>(IncidentCommander.get(`/person`));

export const getPersonWithEmail = (email: string) =>
  resolve<User>(IncidentCommander.get(`/person?email=eq.${email}`));

export const createPerson = ({ name, email, avatar }: NewUser) =>
  resolve<User>(IncidentCommander.post("/person", { name, email, avatar }));
