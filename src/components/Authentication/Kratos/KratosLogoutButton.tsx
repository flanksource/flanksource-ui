import { useCreateLogoutHandler } from "../../ory";

export default function KratosLogoutButton() {
  const onLogout = useCreateLogoutHandler([]);

  return (
    <button
      type="button"
      onClick={onLogout}
      className="block w-full py-2 px-4 text-left text-sm text-gray-700  hover:bg-gray-50 hover:text-gray-900 border-0 border-b border-gray-200"
    >
      Sign out
    </button>
  );
}
