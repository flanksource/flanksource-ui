import { useAuth, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

function getQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isAllowedBackendCallback(rawURL: string, orgBackendURL?: string) {
  try {
    const url = new URL(rawURL);
    const isLocalhost = ["localhost", "127.0.0.1"].includes(url.hostname);
    const isValidProtocol =
      url.protocol === "https:" || (url.protocol === "http:" && isLocalhost);

    if (url.pathname !== "/oidc/clerk/callback" || !isValidProtocol) {
      return false;
    }

    if (isLocalhost) {
      return true;
    }

    if (!orgBackendURL) {
      return false;
    }

    return url.origin === new URL(orgBackendURL).origin;
  } catch {
    return false;
  }
}

export default function ClerkOIDCCallback() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded: isOrganizationLoaded, organization } = useOrganization();
  const formRef = useRef<HTMLFormElement>(null);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [error, setError] = useState<string>();

  const authRequestID = getQueryValue(router.query.auth_request_id);
  const backendCallback = getQueryValue(router.query.backend_callback);
  const orgBackendURL = organization?.publicMetadata.backend_url as
    | string
    | undefined;

  const action = useMemo(() => {
    if (
      !backendCallback ||
      !authRequestID ||
      !isAllowedBackendCallback(backendCallback, orgBackendURL)
    ) {
      return undefined;
    }

    const url = new URL(backendCallback);
    url.searchParams.set("auth_request_id", authRequestID);
    return url.toString();
  }, [authRequestID, backendCallback, orgBackendURL]);

  useEffect(() => {
    if (!router.isReady || !isLoaded || !isOrganizationLoaded) {
      return;
    }

    if (!authRequestID || !backendCallback) {
      setError("Missing OIDC callback parameters");
      return;
    }

    if (!action) {
      setError("Invalid backend callback URL");
      return;
    }

    if (!isSignedIn) {
      router.replace(`/login?return_to=${encodeURIComponent(router.asPath)}`);
      return;
    }

    setShouldSubmit(true);
  }, [
    action,
    authRequestID,
    backendCallback,
    isLoaded,
    isOrganizationLoaded,
    isSignedIn,
    router
  ]);

  useEffect(() => {
    if (shouldSubmit && formRef.current) {
      formRef.current.submit();
    }
  }, [shouldSubmit]);

  if (error) {
    return <div className="p-6 text-red-700">{error}</div>;
  }

  return (
    <>
      <div className="p-6">Completing login...</div>
      {action && shouldSubmit ? (
        <form ref={formRef} method="post" action="/api/oidc/clerk/callback">
          <input type="hidden" name="auth_request_id" value={authRequestID || ""} />
          <input type="hidden" name="backend_callback" value={backendCallback || ""} />
        </form>
      ) : null}
    </>
  );
}
