import { SignUp } from "@clerk/nextjs";
import SignUpLayout from "./SignUpLayout";
import { useRouter } from "next/router";

export default function ClerkRegistration() {
  const { query } = useRouter();

  const redirectUrl = query.redirectUrl ? query.return_to : undefined;

  return (
    <SignUpLayout activeStep={1}>
      <SignUp
        signInUrl="/login"
        afterSignUpUrl={`/create-org?return_to=${redirectUrl}`}
      />
    </SignUpLayout>
  );
}
