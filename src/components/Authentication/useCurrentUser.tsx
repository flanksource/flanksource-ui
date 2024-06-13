import { useUser } from "@clerk/nextjs";
import { Identity } from "@ory/client";
import { useEffect, useState } from "react";
import ory from "./Kratos/ory/sdk";
import useDetermineAuthSystem from "./useDetermineAuthSystem";

export default function useCurrentUserID() {
  const authSystem = useDetermineAuthSystem();

  const [kratosUser, setKratosUser] = useState<Identity | undefined>(undefined);

  useEffect(() => {
    const fetchKratosUser = async () => {
      const {
        data: { identity }
      } = await ory.toSession();

      setKratosUser(identity);
    };

    if (authSystem !== "kratos") {
      return;
    }
    fetchKratosUser();
  }, [authSystem]);

  // We use Clerk's user object as the source of truth for the user's ID.
  const { user } = useUser();

  return authSystem === "kratos" ? kratosUser?.id : user?.id;
}
