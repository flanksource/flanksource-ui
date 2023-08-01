import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { getUser } from "../../../api/auth";
import { User } from "../../../api/services/users";
import { AuthContext } from "../../../context";
import { isAuthEnabled } from "../../../context/Environment";
import ErrorPage from "../../Errors/ErrorPage";
import FullPageSkeletonLoader from "../../SkeletonLoader/FullPageSkeletonLoader";

type Props = {
  children: React.ReactNode;
};

export default function ClerkAuthContextProvider({ children }: Props) {
  const [userDetails, setUserDetails] = useState<User | null>(null);

  const { user } = useUser();

  const { isLoading, error } = useQuery<User | null, AxiosError>(
    ["getUser", !isAuthEnabled()],
    () => getUser(user?.id!),
    {
      onSuccess: (data) => {
        setUserDetails(data ?? null);
      },
      onError: (err) => {
        console.error("Error fetching user", err);
        console.error(err);
      },
      enabled: !!user?.id
    }
  );

  if (error && !userDetails) {
    return <ErrorPage error={error} />;
  }

  if (!userDetails || isLoading) {
    return <FullPageSkeletonLoader />;
  }

  return (
    <AuthContext.Provider
      value={{ user: userDetails, setUser: setUserDetails }}
    >
      {children}
    </AuthContext.Provider>
  );
}
