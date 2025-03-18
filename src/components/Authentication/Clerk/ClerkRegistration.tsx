import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function ClerkRegistration() {
  const { query } = useRouter();

  const returnTo = query.return_to as string;

  return (
    <div className="flex w-full flex-col px-3 text-center">
      <div className="mb-12 flex flex-col">
        <div className="flex flex-col items-center">
          <SignUp
            path="/registration"
            routing="path"
            signInUrl="/login"
            signInForceRedirectUrl={
              returnTo ? `/?return_to=${returnTo}` : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
