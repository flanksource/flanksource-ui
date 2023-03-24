import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE_CACHE } from "../../constants";

export const RouteMemoization = ({
  children
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [previousPath, setPreviousPath] = useState<string>();

  useEffect(() => {
    const routes = JSON.parse(sessionStorage.getItem(ROUTE_CACHE) ?? "{}");

    if (pathname === previousPath || !routes[pathname] || search) {
      sessionStorage.setItem(
        ROUTE_CACHE,
        JSON.stringify({ ...routes, [pathname]: pathname + search })
      );
    } else {
      navigate(routes[pathname], { replace: true });
    }
    setPreviousPath(pathname);
  }, [pathname, search, navigate, previousPath]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
