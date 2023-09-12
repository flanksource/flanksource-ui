import { useAuth } from "@clerk/nextjs";

export default function ClerkLogoutButton() {
  const { signOut } = useAuth();

  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="block w-full py-2 px-4 text-left text-sm text-gray-700  hover:bg-gray-50 hover:text-gray-900 border-0 border-b border-gray-200"
    >
      Sign out
    </button>
  );
}
