import { RedirectToSignIn, useOrganization, useSession } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FullPageSkeletonLoader from "../../SkeletonLoader/FullPageSkeletonLoader";

export const clerkUrls = {
  login: "/login",
  signUp: "/registration",
  createOrganization: "/organizations/create",
  organizationSwitcher: "/organizations/switcher",
  organizationProfile: "/organizations/profile"
} as const;

type Props = {
  children: React.ReactNode;
};

export default function ClerkAuthSessionChecker({ children }: Props) {
  const { isSignedIn, isLoaded: isSessionLoaded } = useSession();
  const { isLoaded: isOrganizationLoaded, organization } = useOrganization();

  const { push } = useRouter();

  useEffect(() => {
    if (isOrganizationLoaded && !organization) {
      push(clerkUrls.organizationSwitcher);
    }
  }, [isOrganizationLoaded, organization, push]);

  if (!isOrganizationLoaded || !isSessionLoaded) {
    return <FullPageSkeletonLoader />;
  }

  if (isSessionLoaded && !isSignedIn) {
    return <RedirectToSignIn />;
  }

  // if the organization backend is not yet created, we need to wait for it to
  // be created
  // if (!organization?.publicMetadata?.created_at) {
  //   return <InstanceCreationInProgress />;
  // }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
