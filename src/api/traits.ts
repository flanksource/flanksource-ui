import { DateType } from "./types/common";
import { User } from "./types/users";

export interface Timestamped extends CreatedAt, UpdatedAt, Deletable {}

export interface CreatedAt {
  created_at?: DateType;
}

export interface Avatar {
  created_by?: Pick<User, "id" | "name" | "avatar">;
}

export interface UpdatedAt {
  updated_at?: DateType;
}

export interface Deletable {
  deleted_at?: DateType;
}

export interface Agent {
  agent_id?: string;
}

export interface Namespaced {
  name: string;
  namespace?: string;
}
