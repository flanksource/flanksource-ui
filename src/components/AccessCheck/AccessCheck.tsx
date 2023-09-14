import { ReactElement, useCallback, useEffect, useState } from "react";
import {
  ActionType,
  useUserAccessStateContext
} from "../../context/UserAccessContext/UserAccessContext";

type AccessCheckProps = {
  resource: string | string[];
  action: ActionType;
  children: ReactElement;
};

export function AccessCheck({ resource, action, children }: AccessCheckProps) {
  const { hasAnyResourceAccess, roles } = useUserAccessStateContext();
  const [render, setRender] = useState(false);

  const checkAccess = useCallback(async () => {
    const shouldRender = await hasAnyResourceAccess(
      Array.isArray(resource) ? resource : [resource],
      action
    );
    setRender(shouldRender);
  }, [action, hasAnyResourceAccess, resource]);

  useEffect(() => {
    checkAccess();
  }, [action, checkAccess, resource, roles]);

  if (render) return children ?? null;

  return null;
}

export const withAccessCheck = (
  component: ReactElement,
  resource: string | string[],
  action: ActionType
) => {
  return (
    <AccessCheck resource={resource} action={action}>
      {component}
    </AccessCheck>
  );
};
