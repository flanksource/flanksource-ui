import { useLocation } from "react-router-dom";
import { useCreateLogoutHandler } from "../../ory";

export default function KratosLogoutButton() {
  const { pathname, search } = useLocation();

  const returnTo = pathname + search;

  const onLogout = useCreateLogoutHandler([]);

  return (
    <button
      type="button"
      onClick={() => onLogout(returnTo)}
      className="block w-full py-2 px-4 text-left text-sm text-gray-700  hover:bg-gray-50 hover:text-gray-900 border-0 border-b border-gray-200"
    >
      Sign out
    </button>
  );
}
