import { AxiosError } from "axios";
import { NextRouter } from "next/router";
import {
  DependencyList,
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from "react";
import toast from "react-hot-toast";
import ory from "./sdk";

export function handleGetFlowError<S>(
  router: NextRouter,
  flowType: "login" | "registration" | "settings" | "recovery" | "verification",
  resetFlow: Dispatch<SetStateAction<S | undefined>>
) {
  return async (err: AxiosError<any>) => {
    switch (err.response?.data.error?.id) {
      case "session_inactive":
        await router.push("/login?return_to=" + window.location.href);
        return;
      case "session_aal2_required":
        if (err.response?.data.redirect_browser_to) {
          const redirectTo = new URL(err.response?.data.redirect_browser_to);
          if (flowType === "settings") {
            redirectTo.searchParams.set("return_to", window.location.href);
          }
          // 2FA is enabled and enforced, but user did not perform 2fa yet!
          window.location.href = redirectTo.toString();
          return;
        }
        await router.push("/login?aal=aal2&return_to=" + window.location.href);
        return;
      case "session_already_available":
        // User is already signed in, let's redirect them home!
        await router.push("/");
        return;
      case "session_refresh_required":
        // We need to re-authenticate to perform this action
        window.location.href = err.response?.data.redirect_browser_to;
        return;
      case "self_service_flow_return_to_forbidden":
        // The flow expired, let's request a new one.
        toast.error("The return_to address is not allowed.");
        resetFlow(undefined);
        await router.push("/" + flowType);
        return;
      case "self_service_flow_expired":
        // The flow expired, let's request a new one.
        toast.error(
          "Your interaction expired, please fill out the form again."
        );
        resetFlow(undefined);
        await router.push("/" + flowType);
        return;
      case "security_csrf_violation":
        // A CSRF violation occurred. Best to just refresh the flow!
        toast.error(
          "A security violation was detected, please fill out the form again."
        );
        resetFlow(undefined);
        await router.push("/" + flowType);
        return;
      case "security_identity_mismatch":
        // The requested item was intended for someone else. Let's request a new flow...
        resetFlow(undefined);
        await router.push("/" + flowType);
        return;
      case "browser_location_change_required":
        // Ory Kratos asked us to point the user to this URL.
        window.location.href = err.response.data.redirect_browser_to;
        return;
    }

    switch (err.response?.status) {
      case 410:
        // The flow expired, let's request a new one.
        resetFlow(undefined);
        await router.push("/" + flowType);
        return;
    }

    // We are not able to handle the error? Return it.
    return Promise.reject(err);
  };
}

// Returns a function which will log the user out
export function useCreateLogoutHandler(deps?: DependencyList) {
  const [logoutToken, setLogoutToken] = useState<string>("");

  useEffect(() => {
    ory
      .createBrowserLogoutFlow()
      .then(({ data }) => {
        setLogoutToken(data.logout_token);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            // do nothing, the user is not logged in
            return;
        }

        // Something else happened!
        return Promise.reject(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return (returnTo: string) => {
    if (logoutToken) {
      ory
        .updateLogoutFlow({
          token: logoutToken,
          returnTo: returnTo
        })
        .then(() => {
          console.warn("Logout successful");
          // this a workaround, react router and next router are not compatible
          // and seem to be conflicting with each other, instead we do a full
          // page reload, which is not ideal, but works for now
          window.location.href = "/login?return_to=" + returnTo;
        })
        .catch((error) => {
          console.error("Logout error:", error.message);
          // this a workaround, react router and next router are not compatible
          // and seem to be conflicting with each other, instead we do a full
          // page reload, which is not ideal, but works for now
          window.location.href = "/login?return_to=" + returnTo;
        });
    }
  };
}
