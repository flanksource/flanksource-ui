import { ReactElement, useCallback, useEffect, useState } from "react";
import { useUserAccessStateContext } from "@flanksource-ui/context/UserAccessContext/UserAccessContext";
import UnauthorizedPage, { UnauthorizedMessage } from "./UnauthorizedPage";
import { ActionType, useUser } from "@flanksource-ui/context";

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
  const { access } = useUser();

  const { hasAnyResourceAccess, isLoading, isLoaded } =
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
  }, [action, checkAccess, resource]);

  if (hasAccess) {
    const partial =
      action === "read" &&
      (Array.isArray(resource) ? resource : [resource]).some(
        (type) => access?.[type]?.read === "some"
      );
    return (
      <>
        {showUnauthorizedMessage && partial && (
          <div
            role="status"
            className="border-b bg-blue-50 px-4 py-2 text-sm text-blue-900"
          >
            Showing only resources you have access to.
          </div>
        )}
        {children}
      </>
    );
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
