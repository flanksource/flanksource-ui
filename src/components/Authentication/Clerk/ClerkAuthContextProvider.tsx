import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { WhoamiResponse, whoami } from "../../../api/services/users";
import { AuthContext } from "../../../context";
import ErrorPage from "../../Errors/ErrorPage";
import FullPageSkeletonLoader from "../../SkeletonLoader/FullPageSkeletonLoader";
import InstanceCreationInProgress from "./InstanceCreationInProgress";

type AuthProviderWrapperProps = {
  children: React.ReactNode;
};

export default function ClerkAuthContextProvider({
  children
}: AuthProviderWrapperProps) {
  // when organization is switched, we need to re-fetch the user and the UI
  const { organization } = useOrganization();

  const {
    data: payload,
    isLoading,
    error
  } = useQuery<WhoamiResponse["payload"], AxiosError>(
    ["user", "whoami", organization],
    () => whoami(),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 0,
      refetchOnReconnect: false
    }
  );

  if (isLoading && !payload) {
    return <FullPageSkeletonLoader />;
  }

  // if the organization backend is not yet created, we need to wait for it to
  if (
    error &&
    (error.response?.status?.toString().startsWith("5") ||
      error?.response?.status === 404)
  ) {
    return <InstanceCreationInProgress />;
  }

  if (error && !payload) {
    return <ErrorPage error={error} />;
  }

  return (
    <AuthContext.Provider value={{ user: payload.user, setUser: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}
