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
      <div className="flex h-auto w-full flex-row items-end space-x-4 border-b border-gray-300 bg-gray-50 p-3">
        <div className="flex-1"></div>
        <div className="flex h-12 flex-row items-center gap-2">
          <OrganizationSwitcher
            hidePersonal
            createOrganizationMode="modal"
            afterSelectOrganizationUrl={`/organizations/orgs-switched`}
            afterCreateOrganizationUrl={`/organizations/orgs-switched`}
          />
          <UserButton />
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center bg-gray-50">
        <div className="mx-auto flex min-h-full flex-col justify-center">
          <div className="flex max-w-screen-lg flex-col gap-2 text-center">
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
