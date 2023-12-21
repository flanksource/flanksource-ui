import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useIntercom } from "react-use-intercom";
import { useUser as useContextUser } from "../../context";
import useDetermineAuthSystem from "../Authentication/useDetermineAuthSystem";
import { INTERCOM_APP_ID } from "./SetupIntercom";

type Props = {
  children: React.ReactNode;
};

function BootIntercomForClerk({ children }: Props) {
  const { boot, shutdown } = useIntercom();
  const { user } = useContextUser();
  const { user: clerkUser } = useUser();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    boot({
      name: user?.name,
      email: user?.email,
      userId: user?.id,
      avatar: {
        type: "avatar",
        imageUrl: user?.avatar
      },
      companies: clerkUser?.organizationMemberships.map((membership) => ({
        companyId: membership.id,
        name: membership.organization.name
      }))
    });

    return () => {
      shutdown();
    };
  }, [boot, clerkUser, shutdown, user]);

  // on sign out, shutdown intercom
  useEffect(() => {
    if (!isSignedIn && isLoaded) {
      shutdown();
    }
  }, [isSignedIn, isLoaded, shutdown]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

function BootIntercomForKratos({ children }: Props) {
  const { boot, shutdown } = useIntercom();
  const { user } = useContextUser();

  useEffect(() => {
    boot({
      name: user?.name,
      email: user?.email,
      userId: user?.id,
      avatar: {
        type: "avatar",
        imageUrl: user?.avatar
      }
    });

    return () => {
      shutdown();
    };
  }, [boot, shutdown, user]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export default function BootIntercom({ children }: Props) {
  const authSystem = useDetermineAuthSystem();

  const isIntercomAppIDset = Boolean(INTERCOM_APP_ID);

  // if intercom app id is not set, don't boot intercom
  if (!isIntercomAppIDset) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  if (authSystem === "clerk") {
    return <BootIntercomForClerk>{children}</BootIntercomForClerk>;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <BootIntercomForKratos>{children}</BootIntercomForKratos>;
}
