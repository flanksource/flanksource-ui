import React, { createContext, useContext } from "react";
import { ActionType, useUser } from "..";

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
  hasAnyResourceAccess: (resourceNames, action) => Promise.resolve(false),
  isLoading: false
};

export const UserAccessStateContext = createContext(initialState);

export const UserAccessStateContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { roles, isLoading, authorizer } = useUser();

  const isAdmin = roles.includes("admin");

  const isViewer = roles.includes("viewer") || roles.includes("guest");

  return (
    <UserAccessStateContext.Provider
      value={{
        isLoading,
        hasResourceAccess: authorizer.hasResourceAccess,
        hasAnyResourceAccess: authorizer.hasAnyResourceAccess,
        isViewer,
        isAdmin,
        roles: roles
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
