import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function ClerkLogin() {
  const { query } = useRouter();

  const returnTo = query.return_to as string;

  return (
    <SignIn
      path="/login"
      routing="path"
      signUpUrl="/registration"
      forceRedirectUrl={returnTo ? `/?return_to=${returnTo}` : undefined}
    />
  );
}
