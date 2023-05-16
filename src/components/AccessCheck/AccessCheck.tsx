import { ReactElement, useEffect, useState } from "react";
import {
  ActionType,
  useUserAccessStateContext
} from "../../context/UserAccessContext/UserAccessContext";

type AccessCheckProps = {
  resource: string;
  action: ActionType;
  children: ReactElement;
};

export function AccessCheck({ resource, action, children }: AccessCheckProps) {
  const { hasResourceAccess } = useUserAccessStateContext();
  const [render, setRender] = useState(false);

  useEffect(() => {
    (async function () {
      const shouldRender = await hasResourceAccess(resource, action);
      setRender(shouldRender);
    })();
  }, [action, resource]);

  if (render) return children ?? null;

  return null;
}

export const withAccessCheck = (
  component: ReactElement,
  resource: string,
  action: ActionType
) => {
  return (
    <AccessCheck resource={resource} action={action}>
      {component}
    </AccessCheck>
  );
};
