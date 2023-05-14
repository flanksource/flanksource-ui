import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useUser } from ".";
import { fetchPeopleRoles } from "../api/services/users";
import { resources } from "../services/permissions/resources";

export const Roles = {
  admin: "admin",
  editor: "editor",
  viewer: "viewer",
  commander: "commander",
  responder: "responder"
};

export type UserAccessState = {
  refresh: () => Promise<void>;
  isAdmin: boolean;
  hasResourceAccess: (_: string) => boolean;
};

const initialState: UserAccessState = {
  refresh: () => Promise.resolve(),
  isAdmin: false,
  hasResourceAccess: (_) => false
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

  const hasResourceAccess = (resourceName: string) => {
    if (
      resources["users.add.role"] === resourceName &&
      resources["users.invite"] === resourceName
    ) {
      return isAdmin;
    }
    return true;
  };

  const fetchUserRoleInfo = async (userId: string) => {
    const { data = [] } = await fetchPeopleRoles([userId]);
    setRoles(data!.find((item) => item.id === userId)?.roles || []);
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
        isAdmin
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
