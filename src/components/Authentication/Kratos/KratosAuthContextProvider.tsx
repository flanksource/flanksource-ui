import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { getUser } from "../../../api/auth";
import { User } from "../../../api/services/users";
import { AuthContext } from "../../../context";
import { isAuthEnabled } from "../../../context/Environment";
import ErrorPage from "../../Errors/ErrorPage";
import FullPageSkeletonLoader from "../../SkeletonLoader/FullPageSkeletonLoader";
import useCurrentKratosUser from "./useCurrentKratosUserID";

type Props = {
  children: React.ReactNode;
};

export default function KratosAuthContextProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);

  const userId = useCurrentKratosUser();

  const { isLoading, error } = useQuery<User | null, AxiosError>(
    ["getUser", !isAuthEnabled()],
    () => getUser(userId!),
    {
      onSuccess: (data) => {
        setUser(data ?? null);
      },
      onError: (err) => {
        console.error("Error fetching user", err);
        console.error(err);
      },
      enabled: !!userId
    }
  );

  if (error && !user) {
    return <ErrorPage error={error} />;
  }

  if (!user || isLoading) {
    return <FullPageSkeletonLoader />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
