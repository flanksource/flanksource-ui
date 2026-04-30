import { FeatureFlagsContextProvider } from "@flanksource-ui/context/FeatureFlagsContext";
import React, { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function BasicAuthSessionChecker({ children }: Props) {
  const [isBrowserEnv, setIsBrowserEnv] = useState(false);

  useEffect(() => {
    setIsBrowserEnv(true);
  }, []);

  if (!isBrowserEnv) {
    return null;
  }

  return <FeatureFlagsContextProvider>{children}</FeatureFlagsContextProvider>;
}
