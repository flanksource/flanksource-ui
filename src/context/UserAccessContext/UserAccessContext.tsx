import React, { createContext, useContext, useMemo } from "react";
import { ActionType, useUser } from "..";

export type UserAccessState = {
  refresh?: () => Promise<unknown>;
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
  const { user, isLoading, authorizer } = useUser();

  const value = useMemo<UserAccessState>(
    () => ({
      isLoading,
      isLoaded: !!user && !isLoading,
      hasResourceAccess: authorizer.hasResourceAccess,
      hasAnyResourceAccess: authorizer.hasAnyResourceAccess
    }),
    [authorizer, isLoading, user]
  );

  return (
    <UserAccessStateContext.Provider value={value}>
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
