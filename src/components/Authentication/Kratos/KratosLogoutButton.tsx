import { useCreateLogoutHandler } from "@flanksource-ui/components/Authentication/Kratos/ory";
import { useLocation } from "react-router-dom";

export default function KratosLogoutButton() {
  const { pathname, search } = useLocation();

  const returnTo = pathname + search;

  const onLogout = useCreateLogoutHandler([]);

  return (
    <button
      type="button"
      onClick={() => onLogout(returnTo)}
      className="block w-full border-0 border-b border-gray-200 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    >
      Sign out
    </button>
  );
}
