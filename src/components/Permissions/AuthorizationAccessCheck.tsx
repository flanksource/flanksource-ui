import { ReactElement, useCallback, useEffect, useState } from "react";
import { useUserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import UnauthorizedPage, { UnauthorizedMessage } from "./UnauthorizedPage";
import { ActionType } from "@flanksource-ui/context";

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
  const [isChecking, setIsChecking] = useState(true);

  const { hasAnyResourceAccess, roles, isLoading, isLoaded } =
    useUserAccessStateContext();

  const [hasAccess, setHasAccess] = useState(false);

  const checkAccess = useCallback(async () => {
    const shouldRender = await hasAnyResourceAccess(
      Array.isArray(resource) ? resource : [resource],
      action
    );
    setHasAccess(shouldRender);
    if (isLoaded) {
      setIsChecking(false);
    }
  }, [action, hasAnyResourceAccess, isLoaded, resource]);

  useEffect(() => {
    checkAccess();
  }, [action, checkAccess, resource, roles]);

  if (hasAccess) {
    return children;
  }

  if (!showUnauthorizedMessage || isLoading || !isLoaded || isChecking) {
    return null;
  }

  if (hideNavbar) {
    return <UnauthorizedMessage />;
  }

  return <UnauthorizedPage isLoading={isLoading || false} />;
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
