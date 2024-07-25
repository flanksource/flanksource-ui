import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function ClerkRegistration() {
  const { query } = useRouter();

  const redirectUrl = query.redirectUrl ? query.return_to : undefined;

  return (
    <div className="flex w-full flex-col px-3 text-center">
      <div className="mb-12 flex flex-col">
        <div className="flex flex-col items-center">
          <SignUp
            path="/registration"
            routing="path"
            signInUrl="/login"
            signInForceRedirectUrl={
              redirectUrl ? `/?return_to=${redirectUrl}` : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
