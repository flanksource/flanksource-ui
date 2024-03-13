import {
  RedirectToSignIn,
  useOrganization,
  useOrganizationList,
  useSession
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FullPageSkeletonLoader from "../../SkeletonLoader/FullPageSkeletonLoader";

export const clerkUrls = {
  login: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/login",
  signUp: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/registration",
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

  // we need to check if the user has an organization and redirect them to the
  // create organization page if they do not
  const { isLoaded: isOrganizationListLoaded, userMemberships } =
    useOrganizationList();

  const { push } = useRouter();

  useEffect(() => {
    if (isOrganizationLoaded && isOrganizationListLoaded && !organization) {
      // we should redirect to the create organization page if the user is
      // signed in and does not have an organization
      if (userMemberships?.count === 0) {
        push(clerkUrls.createOrganization);
        return;
      }
      // otherwise, we should redirect to the organization switcher page
      // may be in the future, we should just display the organization switcher
      // as a modal instead of redirecting
      push(clerkUrls.organizationSwitcher);
    }
  }, [
    isOrganizationListLoaded,
    isOrganizationLoaded,
    organization,
    push,
    userMemberships?.count
  ]);

  if (!isOrganizationLoaded || !isSessionLoaded) {
    return <FullPageSkeletonLoader />;
  }

  if (isSessionLoaded && !isSignedIn) {
    // if the user is not signed in, we should redirect them to the sign in page
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
