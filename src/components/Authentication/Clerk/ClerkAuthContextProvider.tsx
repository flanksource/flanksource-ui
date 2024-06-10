import { useOrganization } from "@clerk/nextjs";
import { useFlanksourceUISnippet } from "@flanksource-ui/hooks/useFlanksourceUISnippet";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { WhoamiResponse, whoami } from "../../../api/services/users";
import { AuthContext } from "../../../context";
import FullPageSkeletonLoader from "../../../ui/SkeletonLoader/FullPageSkeletonLoader";
import ErrorPage from "../../Errors/ErrorPage";
import InstanceCreationInProgress from "./InstanceCreationInProgress";

type AuthProviderWrapperProps = {
  children: React.ReactNode;
};

export default function ClerkAuthContextProvider({
  children
}: AuthProviderWrapperProps) {
  // when organization is switched, we need to re-fetch the user and the UI
  const { organization } = useOrganization();

  const backendURL = organization?.publicMetadata.backend_url;

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

  useFlanksourceUISnippet(payload?.user, organization ?? undefined);

  // if the organization backend is not yet created, we need to wait for it to
  // be created before showing the UI
  if (!backendURL) {
    return <InstanceCreationInProgress />;
  }

  // if the organization backend returns a 404 or a 5xx error, we need to wait
  // for it to be created before showing the UI
  if (
    error &&
    (error.response?.status?.toString().startsWith("5") ||
      error?.response?.status === 404)
  ) {
    return <InstanceCreationInProgress />;
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
