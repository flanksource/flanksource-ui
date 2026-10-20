import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

// LegacyPermissionsBanner warns that Permissions and Permission Groups are
// deprecated and grant nothing, and points to their replacement.
export default function LegacyPermissionsBanner() {
  return (
    <div
      role="alert"
      className="flex flex-row gap-3 rounded-md border-2 border-red-500 bg-red-50 px-4 py-3 text-red-900"
    >
      <FaExclamationTriangle className="mt-1 shrink-0 text-xl text-red-600" />
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold">
          Permissions and Permission Groups are deprecated and no longer grant
          or deny any access.
        </p>
        <p className="text-sm">
          They&apos;re shown read-only so you can migrate them. Recreate each
          one as a{" "}
          <Link
            to="/settings/permissions/scopes"
            className="font-medium underline"
          >
            Scope
          </Link>
          ,{" "}
          <Link
            to="/settings/permissions/roles"
            className="font-medium underline"
          >
            Role
          </Link>{" "}
          and{" "}
          <Link
            to="/settings/permissions/role-bindings"
            className="font-medium underline"
          >
            Role Binding
          </Link>
          , then delete it. New Permissions can&apos;t be created and existing
          ones can&apos;t be changed.
        </p>
      </div>
    </div>
  );
}
