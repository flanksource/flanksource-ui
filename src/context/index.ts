import { createContext, useContext } from "react";
import { User } from "../api/types/users";
import { Authorizer as casbinAuthorizer } from "casbin.js";
import { permDefs, tables } from "./UserAccessContext/permissions";
import { WhoamiResponse } from "@flanksource-ui/api/services/users";
export type ActionType = "write" | "read";

export const Roles = {
  admin: "admin",
  editor: "editor",
  viewer: "viewer",
  guest: "guest",
  commander: "commander",
  responder: "responder"
};

export function createAuthorizer(ctx: WhoamiResponse["payload"]): Authorizer {
  const authorizer = new casbinAuthorizer("manual");
  const builtPerms: Record<ActionType, string[]> = {
    read: [],
    write: []
  };
  const deniedPerms: Record<ActionType, Set<string>> = {
    read: new Set(),
    write: new Set()
  };

  const expandObjects = (object: string) => {
    return object === "*" ? Object.values(tables) : [object];
  };

  const expandActions = (action: string): ActionType[] => {
    const actions = action.split(",").map((item) => item.trim());
    const expanded = new Set<ActionType>();

    if (actions.includes("*") || actions.includes("read")) {
      expanded.add("read");
    }
    if (
      actions.includes("*") ||
      actions.includes("write") ||
      actions.includes("create") ||
      actions.includes("update") ||
      actions.includes("delete")
    ) {
      expanded.add("write");
    }

    return [...expanded];
  };

  (ctx.roles ?? []).forEach((role) => {
    const permissions = permDefs[role as keyof typeof permDefs] ?? {};
    Object.entries(permissions).forEach(([key, value]) => {
      builtPerms[key as ActionType] = [
        ...builtPerms[key as ActionType],
        ...(value as string[])
      ];
    });
  });

  (ctx.permissions ?? []).forEach((permission) => {
    // Resource selector/ABAC permissions are evaluated by the backend against
    // concrete resources. UI route guards only use simple global object grants.
    if (!permission.object || permission.condition) {
      return;
    }

    const objects = expandObjects(permission.object);
    const actions = expandActions(permission.action);

    actions.forEach((action) => {
      if (permission.deny) {
        objects.forEach((object) => deniedPerms[action].add(object));
      } else {
        builtPerms[action] = [...builtPerms[action], ...objects];
      }
    });
  });

  (Object.keys(builtPerms) as ActionType[]).forEach((action) => {
    builtPerms[action] = [...new Set(builtPerms[action])].filter(
      (object) =>
        !deniedPerms[action].has("*") && !deniedPerms[action].has(object)
    );
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
  condition?: string;
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
