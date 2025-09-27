import { UserFormValue } from "@flanksource-ui/components/Users/UserForm";
import {
  Auth,
  CanaryChecker,
  IncidentCommander,
  People,
  Rback
} from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";
import { VersionInfo } from "../types/common";
import { NewUser, PeopleRoles, RegisteredUser, User } from "../types/users";
import { Permission } from "@flanksource-ui/context";

export const getPerson = (id: string) =>
  resolvePostGrestRequestWithPagination<User[]>(
    IncidentCommander.get<User[]>(`/people?id=eq.${id}`)
  );

export const getPersons = () =>
  // email=NULl filters out system user
  resolvePostGrestRequestWithPagination<User[]>(
    IncidentCommander.get<User[]>(
      `/people?select=*&deleted_at=is.null&email=not.is.null&order=name.asc`
    )
  );

export const getPersonWithEmail = (email: string) =>
  resolvePostGrestRequestWithPagination<User>(
    IncidentCommander.get(`/people?email=eq.${email}`)
  );

export const createPerson = ({ name, email, avatar }: NewUser) =>
  resolvePostGrestRequestWithPagination<User>(
    IncidentCommander.post("/people", { name, email, avatar })
  );

export const fetchPeopleRoles = (personIds: string[]) =>
  resolvePostGrestRequestWithPagination<PeopleRoles[]>(
    IncidentCommander.get(`/people_roles?id=in.(${personIds.toString()})`)
  );

export const getRegisteredUsers = () =>
  resolvePostGrestRequestWithPagination<RegisteredUser[]>(
    IncidentCommander.get(`/identities`).then(async (res) => {
      const { data: peopleRoles } = await fetchPeopleRoles(
        res.data.map((item: { id: string }) => item.id)
      );
      const data = res.data.map((item: RegisteredUser) => {
        return {
          ...item,
          created_at: item.created_at,
          state_changed_at: new Date(item.state_changed_at),
          updated_at: item.updated_at,
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

export type InviteUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export const inviteUser = ({
  firstName,
  lastName,
  email,
  role
}: InviteUserPayload) => {
  return Auth.post<{
    link: string;
  }>("/invite_user", { firstName, lastName, email, role });
};

export const getVersionInfo = () =>
  resolvePostGrestRequestWithPagination<VersionInfo>(
    CanaryChecker.get("/about").then((data) => {
      const versionInfo: any = data.data || {};
      data.data = {
        ...versionInfo,
        backend: versionInfo.Version
      };
      return data;
    })
  );

export const updateUserRole = (userId: string, roles: string[]) => {
  return resolvePostGrestRequestWithPagination<{
    message: string;
  }>(
    Rback.post(`/${userId}/update_role`, {
      roles
    })
  );
};

export const updateUser = (user: UserFormValue) => {
  return People.post<{
    email: string;
    name: {
      first: string;
      last: string;
    };
  } | null>(`/update`, user);
};

export const deleteUser = (userId: string) => People.delete(`/${userId}`);

export type WhoamiResponse = {
  message: string;
  payload: {
    database: string;
    hostname: string;
    roles: string[];
    permissions: Permission[];
    user: User;
  };
};

export async function whoami() {
  const res = await Auth.get<WhoamiResponse>(`/whoami`);
  return res.data.payload;
}
