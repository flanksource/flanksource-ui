import React from "react";
import { Head } from "../../../src/components/Head/Head";
import { CreateOrganization } from "@clerk/nextjs";
import SignUpLayout from "../../../src/components/Authentication/Clerk/SignUpLayout";
import useDetermineAuthSystem from "../../../src/components/Authentication/useDetermineAuthSystem";

export default function CreateOrg() {
  const authSystem = useDetermineAuthSystem();

  if (authSystem === "kratos") {
    return null;
  }

  return (
    <>
      <Head prefix="Create Organization" />
      <div className="flex min-h-screen bg-gray-50 justify-center">
        <div className="flex min-h-full flex-col justify-center pt-12 pb-28 sm:px-6 lg:px-8">
          <SignUpLayout activeStep={2}>
            <CreateOrganization />
          </SignUpLayout>
        </div>
      </div>
    </>
  );
}
