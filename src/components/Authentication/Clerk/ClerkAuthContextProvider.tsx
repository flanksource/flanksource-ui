import { useOrganization } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect } from "react";
import { WhoamiResponse, whoami } from "../../../api/services/users";
import { AuthContext } from "../../../context";
import ErrorPage from "../../Errors/ErrorPage";
import BootIntercom from "../../Intercom/BootIntercom";
import FullPageSkeletonLoader from "../../SkeletonLoader/FullPageSkeletonLoader";
import InstanceCreationInProgress from "./InstanceCreationInProgress";

const organizationIDAtom = atomWithStorage<string | undefined>(
  "clerkOrganizationID",
  undefined,
  undefined,
  { getOnInit: true }
);

type AuthProviderWrapperProps = {
  children: React.ReactNode;
};

export default function ClerkAuthContextProvider({
  children
}: AuthProviderWrapperProps) {
  const [orgID, setOrgID] = useAtom(organizationIDAtom);

  // when organization is switched, we need to re-fetch the user and the UI
  const { organization } = useOrganization();

  const backendURL = organization?.publicMetadata.backend_url;

  const client = useQueryClient();

  const {
    data: payload,
    isLoading,
    error
  } = useQuery<WhoamiResponse["payload"], AxiosError>({
    queryKey: ["user", "whoami", organization],
    queryFn: () => whoami(),
    enabled: !!backendURL,
    refetchOnWindowFocus: false,
    refetchInterval: 0,
    refetchOnReconnect: false
  });

  // when the organization is switched, we need to remove the previous queries
  useEffect(() => {
    if (organization && orgID) {
      if (organization.id !== orgID) {
        console.log(`Clearing cache... ${orgID} -> ${organization.id}`);
        client.removeQueries();
        setOrgID(organization.id);
      }
    }
  }, [client, orgID, organization, setOrgID]);

  // if the organization backend is not yet created, we need to wait for it to
  // be created before showing the UI
  if (!backendURL) {
    return (
      <BootIntercom>
        <InstanceCreationInProgress />
      </BootIntercom>
    );
  }

  // if the organization backend returns a 404 or a 5xx error, we need to wait
  // for it to be created before showing the UI
  if (
    error &&
    (error.response?.status?.toString().startsWith("5") ||
      error?.response?.status === 404)
  ) {
    return (
      <BootIntercom>
        <InstanceCreationInProgress />
      </BootIntercom>
    );
  }

  if (isLoading && !payload) {
    return <FullPageSkeletonLoader />;
  }

  if (error && !payload) {
    return <ErrorPage error={error} />;
  }

  return (
    // remove the ?? (payload as any) when the API is updated to return the user
    // inside payload instead of the payload itself
    <AuthContext.Provider
      value={{
        user: payload.user ?? (payload as any),
        backendUrl: backendURL as string
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
