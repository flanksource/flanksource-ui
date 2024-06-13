import ory from "@flanksource-ui/components/Authentication/Kratos/ory/sdk";
import { Identity } from "@ory/client";
import { useEffect, useState } from "react";
import useDetermineAuthSystem from "../useDetermineAuthSystem";

export default function useCurrentKratosUser() {
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

  return authSystem === "kratos" ? kratosUser?.id : undefined;
}
