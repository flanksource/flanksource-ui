import Link from "next/link";
import { useRouter } from "next/router";
import { Head } from "../../Head/Head";
import ErrorPage from "../../Errors/ErrorPage";

export default function ClerkAuthErrors() {
  const { query } = useRouter();

  const code = query.error_code;

  return (
    <>
      <Head prefix="Bad Session Error" />
      <div className="flex min-h-screen bg-gray-50 justify-center">
        <div className="flex min-h-full flex-col justify-center pt-12 pb-28 sm:px-6 lg:px-8">
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
