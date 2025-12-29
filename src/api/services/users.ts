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

export const fetchPeopleWithRoles = (roles?: string[]) => {
  let query = `/people_roles?order=name.asc`;

  if (roles && roles.length > 0) {
    query += `&roles=cs.{${roles.join(",")}}`;
  }

  return resolvePostGrestRequestWithPagination<PeopleRoles[]>(
    IncidentCommander.get(query)
  );
};

export const getPeopleLastLogin = (personIds: string[]) => {
  if (personIds.length === 0) {
    return Promise.resolve({
      data: [] as { id: string; last_login?: string | Date }[]
    });
  }

  return resolvePostGrestRequestWithPagination<
    { id: string; last_login?: string | Date }[]
  >(
    IncidentCommander.get(
      `/people?id=in.(${personIds.join(",")})&select=id,last_login`
    )
  );
};

export const getRegisteredUsers = () =>
  resolvePostGrestRequestWithPagination<RegisteredUser[]>(
    IncidentCommander.get(`/identities`).then(async (identitiesRes) => {
      const ids = identitiesRes.data.map((item: { id: string }) => item.id);
      const [peopleRes, { data: peopleRoles }] = await Promise.all([
        getPeopleLastLogin(ids),
        ids.length > 0 ? fetchPeopleRoles(ids) : Promise.resolve({ data: [] })
      ]);
      const peopleById = new Map(
        (peopleRes.data as { id: string; last_login?: string | Date }[]).map(
          (person) => [person.id, person]
        )
      );
      const data = identitiesRes.data.map((item: RegisteredUser) => {
        const person = peopleById.get(item.id);

        return {
          ...item,
          created_at: item.created_at,
          name: `${item.traits?.name?.first ?? ""} ${
            item.traits?.name?.last ?? ""
          }`,
          email: item.traits.email,
          last_login: person?.last_login,
          roles:
            peopleRoles?.find((peopleRole) => peopleRole.id === item.id)
              ?.roles ?? []
        };
      });
      return {
        ...identitiesRes,
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
