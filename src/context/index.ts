import { createContext, useContext } from "react";
import { User } from "../api/types/users";
import { tables } from "./UserAccessContext/permissions";
import {
  AccessActions,
  AccessSummary,
  WhoamiResponse
} from "@flanksource-ui/api/services/users";

export type ActionType = "write" | "read" | "create" | "update" | "delete";

export const Roles = {
  admin: "admin",
  editor: "editor",
  viewer: "viewer",
  guest: "guest",
  commander: "commander",
  responder: "responder"
};

/** Page and write-control gates use only the server summary; missing grants deny access. */
export function createAuthorizer(ctx: WhoamiResponse["payload"]): Authorizer {
  const can = (resource: string, action: ActionType): boolean => {
    resource = tables[resource as keyof typeof tables] ?? resource;
    if (!ctx.user) {
      return false;
    }
    if (
      action === "read" &&
      [tables.artifacts, tables.tokens, tables.feature_flags].includes(resource)
    ) {
      return true;
    }
    if (resource === tables.people && action !== "read") {
      return ctx.access_actions?.["person:manage"] === true;
    }
    if (resource === tables.feature_flags && action !== "read") {
      return ctx.access_actions?.["property:manage"] === true;
    }
    if (resource in (ctx.access_actions ?? {})) {
      return ctx.access_actions?.[resource] === true;
    }
    const access = ctx.access?.[resource];
    if (action === "read") {
      return access?.read === "all" || access?.read === "some";
    }
    if (action === "write") {
      return [access?.create, access?.update, access?.delete].some(
        (answer) => answer === "all"
      );
    }
    return access?.[action] === "all";
  };

  return {
    hasResourceAccess: (resource, action) =>
      Promise.resolve(can(resource, action)),
    hasAnyResourceAccess: (resources, action) =>
      Promise.resolve(resources.some((resource) => can(resource, action)))
  };
}

export type Authorizer = {
  hasResourceAccess: (
    resourceName: string,
    action: ActionType
  ) => Promise<boolean>;
  hasAnyResourceAccess: (
    resourceNames: string[],
    action: ActionType
  ) => Promise<boolean>;
};

export type Permission = {
  subject: string;
  object: string;
  deny?: boolean;
  action: string;
  condition?: string;
};

interface IAuthContext {
  user?: User;
  backendUrl?: string;
  orgSlug?: string;
  roles: string[];
  permissions: Permission[];
  access?: AccessSummary;
  access_actions?: AccessActions;
  isLoading?: boolean;
  authorizer: Authorizer;
}

export const AuthContext = createContext<IAuthContext>({
  roles: [],
  permissions: [],
  isLoading: false,
  authorizer: {
    hasResourceAccess: () => Promise.resolve(false),
    hasAnyResourceAccess: () => Promise.resolve(false)
  }
});

export const useUser = () => useContext(AuthContext);

/** Signed-in story fixture; callers can supply a restricted summary. */
export const FakeUser = (
  roles: string[],
  access: AccessSummary = Object.fromEntries(
    Object.values(tables).map((type) => [
      type,
      { read: "all", create: "all", update: "all", delete: "all" }
    ])
  )
): IAuthContext => {
  const user = {
    id: "b149b5ee-db1c-4c0c-9711-98d06f1f1ce7",
    email: "admin@local",
    name: "John Doe"
  };
  const access_actions = {
    "person:manage": true,
    "property:manage": true,
    "mcp:use": true,
    "event:read": true,
    "job:read": true
  };
  return {
    roles,
    user,
    permissions: [],
    access,
    access_actions,
    isLoading: false,
    backendUrl: "https://testurl.com",
    authorizer: createAuthorizer({
      roles,
      database: "",
      hostname: "",
      permissions: [],
      user,
      access,
      access_actions
    })
  };
};
