import { ReactElement, useCallback, useEffect, useState } from "react";
import {
  ActionType,
  useUserAccessStateContext
} from "../../context/UserAccessContext/UserAccessContext";
import UnAuthorizedPage, { UnAuthorizedMessage } from "./UnAuhorizedPage";

type AuthorizationAccessCheckProps = {
  resource: string | string[];
  action: ActionType;
  children: ReactElement;
  showUnauthorizedMessage?: boolean;
  hideNavbar?: boolean;
};

export function AuthorizationAccessCheck({
  resource,
  action,
  showUnauthorizedMessage = false,
  children,
  hideNavbar = false
}: AuthorizationAccessCheckProps) {
  const { hasAnyResourceAccess, roles, isLoading } =
    useUserAccessStateContext();
  const [hasAccess, setHasAccess] = useState(false);

  const checkAccess = useCallback(async () => {
    const shouldRender = await hasAnyResourceAccess(
      Array.isArray(resource) ? resource : [resource],
      action
    );
    setHasAccess(shouldRender);
  }, [action, hasAnyResourceAccess, resource]);

  useEffect(() => {
    checkAccess();
  }, [action, checkAccess, resource, roles]);

  if (hasAccess) {
    return children;
  }

  if (!showUnauthorizedMessage || isLoading) {
    return null;
  }

  if (hideNavbar) {
    return <UnAuthorizedMessage />;
  }

  return <UnAuthorizedPage isLoading={isLoading} />;
}

export const withAuthorizationAccessCheck = (
  component: ReactElement,
  resource: string | string[],
  action: ActionType,
  showUnauthorizedMessage = false
) => {
  return (
    <AuthorizationAccessCheck
      resource={resource}
      action={action}
      showUnauthorizedMessage={showUnauthorizedMessage}
    >
      {component}
    </AuthorizationAccessCheck>
  );
};
