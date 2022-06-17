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

type ApiResp<Resource> = Promise<{
  data: Resource;
}>;

export const getPerson = async (id: string): ApiResp<User> =>
  resolve(IncidentCommander.get(`/person?id=eq.${id}`));

export const getPersons = (): ApiResp<User[]> =>
  resolve(IncidentCommander.get(`/person`));

export const getPersonWithEmail = (email: string): ApiResp<User> =>
  resolve(IncidentCommander.get(`/person?email=eq.${email}`));

export const createPerson = ({ name, email, avatar }: NewUser): ApiResp<User> =>
  resolve(IncidentCommander.post("/person", { name, email, avatar }));
