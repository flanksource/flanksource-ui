import { Canary } from "../../components";
import { Auth, CanaryChecker, IncidentCommander } from "../axios";
import { resolve } from "../resolve";

interface NewUser {
  name: string;
  email: string;
  avatar?: string;
}

export type RegisteredUser = {
  id: string;
  nid: string;
  state: string;
  state_changed_at: string | Date;
  name: string;
  email: string;
  traits: {
    name: {
      last: string;
      first: string;
    };
    email: string;
  };
  created_at: string | Date;
  updated_at: string | Date;
};

export interface User extends NewUser {
  id: string;
}

export type InviteUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
};

export const getPerson = (id: string) =>
  resolve<User>(IncidentCommander.get(`/people?id=eq.${id}`));

export const getPersons = () =>
  resolve<User[]>(IncidentCommander.get(`/people`));

export const getPersonWithEmail = (email: string) =>
  resolve<User>(IncidentCommander.get(`/people?email=eq.${email}`));

export const createPerson = ({ name, email, avatar }: NewUser) =>
  resolve<User>(IncidentCommander.post("/people", { name, email, avatar }));

export const getRegisteredUsers = () =>
  resolve<RegisteredUser[]>(
    IncidentCommander.get(`/identities`).then((res) => {
      const data = res.data.map((item: RegisteredUser) => {
        return {
          ...item,
          created_at: new Date(item.created_at),
          state_changed_at: new Date(item.state_changed_at),
          updated_at: new Date(item.updated_at),
          name: `${item.traits?.name?.first ?? ""} ${
            item.traits?.name?.last ?? ""
          }`,
          email: item.traits.email
        };
      });
      return {
        ...res,
        data
      };
    })
  );

export const inviteUser = ({ firstName, lastName, email }: InviteUserPayload) =>
  resolve<{}>(Auth.post("/invite_user", { firstName, lastName, email }));

export const getVersionInfo = () => resolve<{}>(CanaryChecker.get("/about"));
