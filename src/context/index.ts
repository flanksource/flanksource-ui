import { createContext, useContext } from "react";
import { User } from "../api/types/users";
import { Authorizer as casbinAuthorizer } from "casbin.js";
import { permDefs } from "./UserAccessContext/permissions";
import { WhoamiResponse } from "@flanksource-ui/api/services/users";
export type ActionType = "write" | "read";

export const Roles = {
  admin: "admin",
  editor: "editor",
  viewer: "viewer",
  commander: "commander",
  responder: "responder"
};

export function createAuthorizer(ctx: WhoamiResponse["payload"]): Authorizer {
  const authorizer = new casbinAuthorizer("manual");
  const builtPerms: Record<string, any> = {};

  ctx.roles.forEach((role) => {
    const permissions = permDefs[role as keyof typeof permDefs] ?? {};
    Object.entries(permissions).forEach(([key, value]) => {
      builtPerms[key] = [...(builtPerms[key] || []), ...value];
    });
  });
  authorizer.setPermission(builtPerms);
  return {
    hasResourceAccess: (resourceName, action) => {
      return authorizer.can(action, resourceName);
    },
    hasAnyResourceAccess: (resourceNames, action) => {
      return authorizer.canAny(action, resourceNames);
    }
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
};

interface IAuthContext {
  user?: User;
  backendUrl?: string;
  orgSlug?: string;
  roles: string[];
  permissions: Permission[];
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

export const FakeUser = (roles: string[]): IAuthContext => {
  let user = {
    id: "b149b5ee-db1c-4c0c-9711-98d06f1f1ce7",
    email: "admin@local",
    name: "John Doe"
  };
  return {
    roles: roles,
    user: user,
    permissions: [],
    isLoading: false,
    backendUrl: "https://testurl.com",
    authorizer: createAuthorizer({
      roles: roles,
      database: "",
      hostname: "",
      permissions: [],
      user: user
    })
  };
};
