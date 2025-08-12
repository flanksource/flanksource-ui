import useDetermineAuthSystem from "@flanksource-ui/components/Authentication/useDetermineAuthSystem";
import { useUser } from "@flanksource-ui/context";

export function useAgentsBaseURL() {
  const { backendUrl } = useUser();
  const authSystem = useDetermineAuthSystem();

  // if we are on the SaaS platform, we need to use the backend URL from the user
  // profile, not the current URL
  const baseUrl =
    authSystem === "clerk" ? backendUrl : window.location.origin + "/api";

  return baseUrl;
}
