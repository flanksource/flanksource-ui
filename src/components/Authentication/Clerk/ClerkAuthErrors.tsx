import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { Head } from "../../../ui/Head";
import ErrorPage from "../../Errors/ErrorPage";

export default function ClerkAuthErrors() {
  const { query } = useRouter();

  const code = query.error_code;

  return (
    <>
      <Head prefix="Bad Session Error" />
      <div className="flex flex-row h-auto w-full bg-gray-50 p-3 space-x-4 items-end border-b border-gray-300">
        <div className="flex-1 "></div>
        <div className="h-12 flex flex-row gap-2 items-center">
          <OrganizationSwitcher
            hidePersonal
            createOrganizationMode="modal"
            afterSelectOrganizationUrl={`/organizations/orgs-switched`}
            afterCreateOrganizationUrl={`/organizations/orgs-switched`}
          />
          <UserButton />
        </div>
      </div>
      <div className="flex flex-col flex-1 bg-gray-50 justify-center">
        <div className="flex min-h-full flex-col justify-center mx-auto">
          <div className="flex flex-col max-w-screen-lg gap-2 text-center">
            {code === "BAD_SESSION" ? (
              <ErrorPage
                error={
                  new Error(
                    "Bad Session. Please try logging out and logging in again, if the problem persist, please contact us."
                  )
                }
                hideCause
              />
            ) : (
              <ErrorPage error={new Error("Unknown error")} />
            )}
            <div>
              <Link href="/" passHref>
                <div>Go back</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
