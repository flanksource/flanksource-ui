import { ReactElement, useCallback, useEffect, useState } from "react";
import {
  ActionType,
  useUserAccessStateContext
} from "../../context/UserAccessContext/UserAccessContext";

type AuthorizationAccessCheckProps = {
  resource: string | string[];
  action: ActionType;
  children: ReactElement;
};

export function AuthorizationAccessCheck({
  resource,
  action,
  children
}: AuthorizationAccessCheckProps) {
  const { hasAnyResourceAccess, roles } = useUserAccessStateContext();
  const [hasAccess, setHasAccess] = useState(false);

  console.log("roles", roles);

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

  return null;
}

export const withAuthorizationAccessCheck = (
  component: ReactElement,
  resource: string | string[],
  action: ActionType
) => {
  return (
    <AuthorizationAccessCheck resource={resource} action={action}>
      {component}
    </AuthorizationAccessCheck>
  );
};
