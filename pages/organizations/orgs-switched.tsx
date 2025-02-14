import FullPageSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/FullPageSkeletonLoader";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 *
 * This page is used to clear the query cache when the user switches
 * organizations. It is used in the `afterSelectOrganizationUrl` prop of the
 * `OrganizationSwitcher` component.
 *
 * It clears the query cache and then redirects the user to the home page.
 *
 */
export default function OrgsSwitchedPage() {
  const client = useQueryClient();
  const { push } = useRouter();

  useEffect(() => {
    client.clear();
    push("/topology");
  }, [client, push]);

  return <FullPageSkeletonLoader />;
}
