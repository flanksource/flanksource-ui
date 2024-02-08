import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { clerkUrls } from "./ClerkAuthSessionChecker";
import SignUpLayout from "./SignUpLayout";

export default function ClerkRegistration() {
  const { query } = useRouter();

  const redirectUrl = query.redirectUrl ? query.return_to : undefined;

  return (
    <SignUpLayout activeStep={1}>
      <SignUp
        routing="path"
        signInUrl="/login"
        afterSignUpUrl={`/${clerkUrls.createOrganization}?return_to=${redirectUrl}`}
        afterSignInUrl={`/`}
      />
    </SignUpLayout>
  );
}
