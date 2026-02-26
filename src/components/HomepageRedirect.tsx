// ABOUTME: Resolves the homepage destination based on a configured view property,
// ABOUTME: a well-known view name, or falls back to the health page.

import { useQuery } from "@tanstack/react-query";
import React, { Suspense } from "react";
import {
  getViewIdByName,
  getViewIdByNamespaceAndName
} from "../api/services/views";
import { useFeatureFlagsContext } from "../context/FeatureFlagsContext";
import { HealthPage } from "../pages/health";
import FullPageSkeletonLoader from "../ui/SkeletonLoader/FullPageSkeletonLoader";

import {
  DASHBOARD_VIEW_PROPERTY,
  FALLBACK_VIEW_NAME,
  UUID_REGEX
} from "./dashboardViewConstants";

const SingleView = React.lazy(
  () => import("../pages/views/components/SingleView")
);

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
    (f) => f.name === DASHBOARD_VIEW_PROPERTY
  )?.value;

  const isUUID = dashboardViewValue && UUID_REGEX.test(dashboardViewValue);

  const { data: viewId, isLoading } = useQuery({
    queryKey: ["homepage-redirect", dashboardViewValue],
    queryFn: async () => {
      if (dashboardViewValue) {
        return resolveViewId(dashboardViewValue);
      }
      return getViewIdByName(FALLBACK_VIEW_NAME);
    },
    enabled: !isUUID,
    staleTime: 5 * 60 * 1000
  });

  const resolvedViewId = isUUID ? dashboardViewValue : viewId;

  if (!isUUID && isLoading) {
    return <FullPageSkeletonLoader />;
  }

  if (resolvedViewId) {
    return (
      <Suspense fallback={<FullPageSkeletonLoader />}>
        <SingleView id={resolvedViewId} />
      </Suspense>
    );
  }

  return <HealthPage url="/api/canary/api/summary" />;
}
