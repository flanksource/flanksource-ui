import { useOrganization, useSession } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FullPageSkeletonLoader from "../../../ui/SkeletonLoader/FullPageSkeletonLoader";
import ClerkOrgModal from "./ClerkOrgModal";

export const accountsUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL;
export const clerkUrls = {
  login: `/login`,
  createOrganization: `${accountsUrl}/create-organization`,
  organizationSwitcher: `/organizations/switcher`,
  organizationProfile: `/organizations/profile`
} as const;

type Props = {
  children: React.ReactNode;
};

export default function ClerkAuthSessionChecker({ children }: Props) {
  const { isSignedIn, isLoaded: isSessionLoaded } = useSession();
  const { isLoaded: isOrganizationLoaded, organization } = useOrganization();

  const { push } = useRouter();

  useEffect(() => {
    if (isSessionLoaded && !isSignedIn) {
      window.location.href = clerkUrls.login;
      return;
    }
  }, [isSessionLoaded, isSignedIn, push]);

  if (!isOrganizationLoaded || !isSessionLoaded) {
    return <FullPageSkeletonLoader />;
  }

  if (isSessionLoaded && !isSignedIn) {
    return <FullPageSkeletonLoader />;
  }

  if (!organization) {
    return <ClerkOrgModal />;
  }

  // if the organization backend is not yet created, we need to wait for it to
  // be created
  // if (!organization?.publicMetadata?.created_at) {
  //   return <InstanceCreationInProgress />;
  // }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
