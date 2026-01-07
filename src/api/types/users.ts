import { Avatar, CreatedAt, Timestamped } from "../traits";

export interface NewUser {
  name: string;
  email: string;
  avatar?: string;
  roles?: string;
}

export interface RegisteredUser extends CreatedAt {
  id: string;
  state: string;
  name: string;
  email: string;
  traits: {
    name: {
      last: string;
      first: string;
    };
    email: string;
  };
  roles?: string[];
  last_login?: string | Date;
  teams?: Team[];
}

export type PeopleRoles = {
  id: string;
  name: string;
  email: string;
  roles: string[];
};

export interface User extends NewUser {
  id: string;
}

export type UserWithTeam = User & {
  team: {
    icon: string;
    name: string;
  };
};

export interface Team extends Timestamped, Avatar {
  id: string;
  name: string;
  icon: string;
  spec: Record<string, any>;
  source?: string;
}
