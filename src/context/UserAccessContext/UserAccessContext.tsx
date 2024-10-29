import { usePeopleRoles } from "@flanksource-ui/hooks/ReactQuery/roles";
import { Authorizer } from "casbin.js";
import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useUser } from "..";
import { permDefs } from "./permissions";

export type ActionType = "write" | "read";

export const Roles = {
  admin: "admin",
  editor: "editor",
  viewer: "viewer",
  commander: "commander",
  responder: "responder"
};

export const casbinAuthorizer = new Authorizer("manual");

export type UserAccessState = {
  refresh?: () => Promise<unknown>;
  isAdmin: boolean;
  isViewer: boolean;
  roles: string[];
  isLoading?: boolean;
  isLoaded?: boolean;
  hasResourceAccess: (
    resourceName: string,
    action: ActionType
  ) => Promise<boolean>;
  hasAnyResourceAccess: (
    resourceNames: string[],
    action: ActionType
  ) => Promise<boolean>;
};

const initialState: UserAccessState = {
  isAdmin: false,
  isViewer: false,
  roles: [],
  hasResourceAccess: (resourceName, action) => Promise.resolve(false),
  hasAnyResourceAccess: (resourceNames, action) => Promise.resolve(false)
};

export const UserAccessStateContext = createContext(initialState);

export const UserAccessStateContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { user, roles, permissions } = useUser();
  const _roles = roles || [];

  const defineRulesFor = useCallback((roles?: string[]) => {
    const builtPerms: Record<string, any> = {};

    _roles.forEach((role) => {
      const permissions = permDefs[role as keyof typeof permDefs] ?? {};
      Object.entries(permissions).forEach(([key, value]) => {
        builtPerms[key] = [...(builtPerms[key] || []), ...value];
      });
    });
    casbinAuthorizer.setPermission(builtPerms);
  }, []);

  const isAdmin = _roles.includes("admin");

  const isViewer = _roles.includes("viewer");

  const hasResourceAccess = (resourceName: string, action: ActionType) => {
    defineRulesFor(roles);
    return casbinAuthorizer.can(action, resourceName);
  };

  const hasAnyResourceAccess = (
    resourceNames: string[],
    action: ActionType
  ) => {
    defineRulesFor(roles);
    return casbinAuthorizer.canAny(action, resourceNames);
  };

  return (
    <UserAccessStateContext.Provider
      value={{
        hasResourceAccess,
        hasAnyResourceAccess,
        isViewer,
        isAdmin,
        roles: _roles
      }}
    >
      {children}
    </UserAccessStateContext.Provider>
  );
};

export const useUserAccessStateContext = () => {
  const context = useContext(UserAccessStateContext);

  if (context === undefined) {
    throw new Error(
      "useUserAccessStateContext must be used within a UserAccessStateContextProvider"
    );
  }
  return context;
};
