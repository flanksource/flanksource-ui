import { ReactElement, useCallback, useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import {
  ActionType,
  useUserAccessStateContext
} from "../../context/UserAccessContext/UserAccessContext";

type AuthorizationAccessCheckProps = {
  resource: string | string[];
  action: ActionType;
  children: ReactElement;
  showUnauthorizedMessage?: boolean;
};

export function AuthorizationAccessCheck({
  resource,
  action,
  showUnauthorizedMessage = false,
  children
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

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <h1 className="font-semibold text-red-500">
        <FaExclamationCircle className="mr-2 inline-block" />
        Unauthorized
      </h1>
      <p>You do not have permission to access this page</p>
    </div>
  );
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
