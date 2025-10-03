import { useGetConfigByIdQuery } from "@flanksource-ui/api/query-hooks";
import { useConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigTabsLinks";
import { Loading } from "@flanksource-ui/ui/Loading";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function ConfigDetailsIndexRedirect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const idParam = id ?? "";

  const {
    data: configDetails,
    isLoading: isConfigLoading,
    isError: isConfigError
  } = useGetConfigByIdQuery(idParam);

  const tabs = useConfigDetailsTabs(configDetails?.summary);

  useEffect(() => {
    if (!id || tabs.length === 0) {
      return;
    }

    const firstTab = tabs[0];

    if (!firstTab || location.pathname === firstTab.path) {
      return;
    }

    navigate(
      {
        pathname: firstTab.path,
        search: firstTab.search ?? location.search
      },
      { replace: true }
    );
  }, [id, tabs, navigate, location.pathname, location.search]);

  if (isConfigLoading && tabs.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isConfigError) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Failed to load config
      </div>
    );
  }

  return null;
}
