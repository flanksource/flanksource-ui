import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { User, whoami } from "../../../api/services/users";
import { AuthContext } from "../../../context";
import ErrorPage from "../../Errors/ErrorPage";
import FullPageSkeletonLoader from "../../SkeletonLoader/FullPageSkeletonLoader";

type Props = {
  children: React.ReactNode;
};

export default function KratosAuthContextProvider({ children }: Props) {
  const {
    data: user,
    isLoading,
    error
  } = useQuery<User, AxiosError>(["user", "whoami"], () => whoami(), {
    refetchOnWindowFocus: false,
    refetchInterval: 0,
    refetchOnReconnect: false
  });

  if (isLoading && !user) {
    return <FullPageSkeletonLoader />;
  }

  if (error && !user) {
    return <ErrorPage error={error} />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}
