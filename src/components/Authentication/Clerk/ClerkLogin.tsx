import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function ClerkLogin() {
  const { query } = useRouter();

  const redirectUrl = query.redirectUrl
    ? (query.return_to as string)
    : undefined;

  return (
    <SignIn
      routing="path"
      signUpUrl="/registration"
      afterSignUpUrl={`/?return_to=${redirectUrl}`}
    />
  );
}
