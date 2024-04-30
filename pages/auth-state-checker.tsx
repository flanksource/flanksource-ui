import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React from "react";
import useDetermineAuthSystem from "../src/components/Authentication/useDetermineAuthSystem";
import FullPageSkeletonLoader from "../src/ui/SkeletonLoader/FormSkeletonLoader";

export function ClerkAuthStateChecker() {
  const { push, query } = useRouter();

  const returnURL = query.return_to as string;

  const { isLoaded, isSignedIn } = useSession();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      push(`/login?return_to=${returnURL}`);
    } else {
      push("/error?error_code=BAD_SESSION");
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
