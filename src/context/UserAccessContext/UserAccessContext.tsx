import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { Authorizer } from "casbin.js";
import { useUser } from "..";
import { fetchPeopleRoles } from "../../api/services/users";
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
  refresh: () => Promise<void>;
  isAdmin: boolean;
  roles: string[];
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
  refresh: () => Promise.resolve(),
  isAdmin: false,
  roles: [],
  hasResourceAccess: (resourceName, action) => Promise.resolve(false),
  hasAnyResourceAccess: (resourceNames, action) => Promise.resolve(false)
};

const UserAccessStateContext = createContext(initialState);

export const UserAccessStateContextProvider = ({
  children
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  const { user } = useUser();
  const [roles, setRoles] = useState<string[]>([]);
  const isAdmin = useMemo(() => {
    return roles.includes("admin");
  }, [roles]);

  const defineRulesFor = (roles: string[]) => {
    const builtPerms: Record<string, any> = {};
    roles.forEach((role) => {
      const permissions = permDefs[role as keyof typeof permDefs] ?? {};
      Object.entries(permissions).forEach(([key, value]) => {
        builtPerms[key] = [...(builtPerms[key] || []), ...value];
      });
    });
    casbinAuthorizer.setPermission(builtPerms);
  };

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

  const fetchUserRoleInfo = async (userId: string) => {
    const { data = [] } = await fetchPeopleRoles([userId]);
    let roles = data!.find((item) => item.id === userId)?.roles || [];
    if (!roles.length) {
      roles = [Roles.viewer];
    }
    setRoles(roles);
  };

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    fetchUserRoleInfo(user.id);
  }, [user?.id]);

  return (
    <UserAccessStateContext.Provider
      value={{
        refresh: () => fetchUserRoleInfo(user!.id),
        hasResourceAccess,
        hasAnyResourceAccess,
        isAdmin,
        roles
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
