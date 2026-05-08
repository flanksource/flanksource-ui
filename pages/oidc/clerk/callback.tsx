import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

function getQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function ClerkOIDCCallback() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [error, setError] = useState<string>();

  const authRequestID = getQueryValue(router.query.auth_request_id);

  useEffect(() => {
    if (!router.isReady || !isLoaded) {
      return;
    }

    if (!authRequestID) {
      setError("Missing OIDC callback parameters");
      return;
    }

    if (!isSignedIn) {
      router.replace(`/login?return_to=${encodeURIComponent(router.asPath)}`);
      return;
    }

    setShouldSubmit(true);
  }, [authRequestID, isLoaded, isSignedIn, router]);

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
      {shouldSubmit ? (
        <form ref={formRef} method="post" action="/api/oidc/clerk/callback">
          <input
            type="hidden"
            name="auth_request_id"
            value={authRequestID || ""}
          />
        </form>
      ) : null}
    </>
  );
}
