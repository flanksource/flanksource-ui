import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React from "react";
import FullPageSkeletonLoader from "../src/components/SkeletonLoader/FullPageSkeletonLoader";
import useDetermineAuthSystem from "../src/components/Authentication/useDetermineAuthSystem";

export function ClerkAuthStateChecker() {
  const { push, query } = useRouter();

  const returnURL = query.return_to as string;

  const { isLoaded, isSignedIn } = useSession();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      push(`/login?return_to=${returnURL}`);
    } else {
      push("/error?code=BAD_SESSION");
    }
  }, [isLoaded, isSignedIn, push, returnURL]);

  return <FullPageSkeletonLoader />;
}

export default function AuthStateCheckerPage() {
  const authSystem = useDetermineAuthSystem();

  if (authSystem === "kratos") {
    return <FullPageSkeletonLoader />;
  }

  return <ClerkAuthStateChecker />;
}
