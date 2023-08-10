import { SignUp } from "@clerk/nextjs";
import SignUpLayout from "./SignUpLayout";
import { useRouter } from "next/router";
import { clerkUrls } from "./ClerkAuthSessionChecker";

export default function ClerkRegistration() {
  const { query } = useRouter();

  const redirectUrl = query.redirectUrl ? query.return_to : undefined;

  return (
    <SignUpLayout activeStep={1}>
      <SignUp
        signInUrl="/login"
        afterSignUpUrl={`/${clerkUrls.createOrganization}?return_to=${redirectUrl}`}
      />
    </SignUpLayout>
  );
}
