import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { WhoamiResponse, whoami } from "../../../api/services/users";
import { AuthContext } from "../../../context";
import FullPageSkeletonLoader from "../../../ui/SkeletonLoader/FullPageSkeletonLoader";
import ErrorPage from "../../Errors/ErrorPage";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

type Props = {
  children: React.ReactNode;
};

export default function KratosAuthContextProvider({ children }: Props) {
  const {
    data: payload,
    isLoading,
    error
  } = useQuery<WhoamiResponse["payload"], AxiosError>(
    ["user", "whoami"],
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

  if (error && !payload) {
    return <ErrorPage error={error} />;
  }

  return (
    <AuthContext.Provider
      value={{ user: payload.user, backendUrl: backendURL }}
    >
      {children}
    </AuthContext.Provider>
  );
}
