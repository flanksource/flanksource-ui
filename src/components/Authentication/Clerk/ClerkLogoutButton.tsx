import { useAuth } from "@clerk/nextjs";

export default function ClerkLogoutButton() {
  const { signOut } = useAuth();

  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="block w-full border-0 border-b border-gray-200 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    >
      Sign out
    </button>
  );
}
