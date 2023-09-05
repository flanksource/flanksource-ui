import { Auth, CanaryChecker, IncidentCommander, Rback } from "../axios";
import { resolve } from "../resolve";
import packageJson from "../../../package.json";

interface NewUser {
  name: string;
  email: string;
  avatar?: string;
}

export type VersionInfo = {
  frontend: string;
  backend: string;
  Version: string;
  Timestamp: string;
};

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
  roles?: string[];
};

export type PeopleRoles = {
  id: string;
  name: string;
  email: string;
  roles: string[];
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
  resolve<User[]>(IncidentCommander.get<User[]>(`/people?id=eq.${id}`));

export const getPersons = () =>
  resolve<User[]>(IncidentCommander.get<User[]>(`/people`));

export const getPersonWithEmail = (email: string) =>
  resolve<User>(IncidentCommander.get(`/people?email=eq.${email}`));

export const createPerson = ({ name, email, avatar }: NewUser) =>
  resolve<User>(IncidentCommander.post("/people", { name, email, avatar }));

export const fetchPeopleRoles = (personIds: string[]) =>
  resolve<PeopleRoles[]>(
    IncidentCommander.get(`/people_roles?id=in.(${personIds.toString()})`)
  );

export const getRegisteredUsers = () =>
  resolve<RegisteredUser[]>(
    IncidentCommander.get(`/identities`).then(async (res) => {
      const { data: peopleRoles } = await fetchPeopleRoles(
        res.data.map((item: { id: string }) => item.id)
      );
      const data = res.data.map((item: RegisteredUser) => {
        return {
          ...item,
          created_at: new Date(item.created_at),
          state_changed_at: new Date(item.state_changed_at),
          updated_at: new Date(item.updated_at),
          name: `${item.traits?.name?.first ?? ""} ${
            item.traits?.name?.last ?? ""
          }`,
          email: item.traits.email,
          roles:
            peopleRoles?.find((peopleRoles) => peopleRoles.id === item.id)
              ?.roles ?? []
        };
      });
      return {
        ...res,
        data
      };
    })
  );

export const inviteUser = ({ firstName, lastName, email }: InviteUserPayload) =>
  resolve<{
    id: string;
  }>(Auth.post("/invite_user", { firstName, lastName, email }));

export const getVersionInfo = () =>
  resolve<VersionInfo>(
    CanaryChecker.get("/about").then((data) => {
      const versionInfo: any = data.data || {};
      data.data = {
        ...versionInfo,
        frontend: packageJson.version,
        backend: versionInfo.Version
      };
      return data;
    })
  );

export const updateUserRole = (userId: string, roles: string[]) => {
  return resolve<{
    message: string;
  }>(
    Rback.post(`/${userId}/update_role`, {
      roles
    })
  );
};

export const deleteUser = (userId: string) =>
  resolve<{}>(IncidentCommander.delete(`/identities?id=eq.${userId}`));

export type WhoamiResponse = {
  message: string;
  payload: {
    database: string;
    hostname: string;
    user: User;
  };
};

export async function whoami() {
  const res = await Auth.get<WhoamiResponse>(`/whoami`);
  return res.data.payload;
}
