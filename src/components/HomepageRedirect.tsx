// ABOUTME: Resolves the homepage destination based on a configured view property,
// ABOUTME: a well-known view name, or falls back to the health page.

import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import {
  getViewIdByName,
  getViewIdByNamespaceAndName
} from "../api/services/views";
import { useFeatureFlagsContext } from "../context/FeatureFlagsContext";
import FullPageSkeletonLoader from "../ui/SkeletonLoader/FullPageSkeletonLoader";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const FALLBACK_VIEW_NAME = "mission-control-dashboard";

async function resolveViewId(value: string): Promise<string | undefined> {
  if (value.includes("/")) {
    const [namespace, name] = value.split("/", 2);
    return getViewIdByNamespaceAndName(namespace, name);
  }
  return getViewIdByName(value);
}

export function HomepageRedirect() {
  const { featureFlags } = useFeatureFlagsContext();

  const dashboardViewValue = featureFlags.find(
    (f) => f.name === "defaults.dashboard_view"
  )?.value;

  const isUUID = dashboardViewValue && UUID_REGEX.test(dashboardViewValue);

  const { data: redirectPath, isLoading } = useQuery({
    queryKey: ["homepage-redirect", dashboardViewValue],
    queryFn: async () => {
      if (dashboardViewValue) {
        const viewId = await resolveViewId(dashboardViewValue);
        if (viewId) return `/views/${viewId}`;
        return "/health";
      }

      const viewId = await getViewIdByName(FALLBACK_VIEW_NAME);
      if (viewId) return `/views/${viewId}`;
      return "/health";
    },
    enabled: !isUUID
  });

  if (isUUID) {
    return <Navigate to={`/views/${dashboardViewValue}`} replace />;
  }

  if (isLoading || !redirectPath) {
    return <FullPageSkeletonLoader />;
  }

  return <Navigate to={redirectPath} replace />;
}
