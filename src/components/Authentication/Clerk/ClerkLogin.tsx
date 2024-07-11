import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function ClerkLogin() {
  const { query } = useRouter();

  const redirectUrl = query.redirectUrl
    ? (query.return_to as string)
    : undefined;

  return (
    <SignIn
      path="/login"
      routing="path"
      signUpUrl="/registration"
      fallbackRedirectUrl={`/?return_to=${redirectUrl}`}
    />
  );
}
