import { Avatar, CreatedAt, Timestamped, UpdatedAt } from "../traits";

export interface NewUser {
  name: string;
  email: string;
  avatar?: string;
  roles?: string;
}

export interface RegisteredUser extends CreatedAt, UpdatedAt {
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
  roles?: string[];
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
