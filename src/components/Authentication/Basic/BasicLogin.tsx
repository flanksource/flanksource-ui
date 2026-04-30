import FormSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/FormSkeletonLoader";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function BasicLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("return_to") || "/";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(undefined);
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(
          data?.message ||
            data?.error ||
            `${response.status}: ${response.statusText}`
        );
        setSubmitting(false);
        return;
      }

      router.push(returnTo);
    } catch (err) {
      setError(String(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="w-96">
      <div>
        <Image
          height={288}
          width={75}
          alt="Mission Control"
          src="/images/logo.svg"
          className="m-auto h-auto w-72 rounded-8px p-2"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign In to your account
        </h2>
        <div className="mt-8 bg-white px-4 pb-8 pt-4 shadow sm:rounded-lg sm:px-10">
          {submitting ? (
            <FormSkeletonLoader />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
