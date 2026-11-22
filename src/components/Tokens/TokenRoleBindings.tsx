import { TokenRoleBinding } from "@flanksource-ui/api/services/tokens";
import { FaTrash, FaUndo } from "react-icons/fa";

/**
 * Lists the RoleBindings that limit an access token, with the Role each limits it to. With onChange, it edits roles,
 * the staged list of Roles as namespace/name: bound Roles left out of it show as removed, and Roles not yet bound
 * show as new.
 */
export function TokenRoleBindings({
  bindings = [],
  roles,
  onChange,
  disabled = false
}: {
  bindings?: TokenRoleBinding[];
  roles?: string[];
  onChange?: (roles: string[]) => void;
  disabled?: boolean;
}) {
  const staged = roles ?? bindings.map((binding) => binding.role);
  const added = staged.filter(
    (role) => !bindings.some((binding) => binding.role === role)
  );

  if (bindings.length === 0 && added.length === 0) {
    return (
      <p className="rounded-md border bg-gray-50 p-3 text-sm text-orange-700">
        No role binding limits this token, so it can do nothing.
      </p>
    );
  }

  const button = (role: string, remove: boolean) =>
    onChange && (
      <button
        type="button"
        disabled={disabled}
        aria-label={`${remove ? "Remove" : "Keep"} ${role}`}
        title={`${remove ? "Remove" : "Keep"} ${role}`}
        className="text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() =>
          onChange(
            remove ? staged.filter((r) => r !== role) : [...staged, role]
          )
        }
      >
        {remove ? <FaTrash className="hover:text-red-600" /> : <FaUndo />}
      </button>
    );

  return (
    <ul className="max-h-48 divide-y overflow-y-auto rounded-md border bg-gray-50">
      {bindings.map((binding) => {
        const removed = !staged.includes(binding.role);
        return (
          <li key={binding.id} className="flex flex-col gap-0.5 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`break-all text-sm font-medium ${removed ? "text-gray-400 line-through" : "text-gray-900"}`}
              >
                {binding.role}
              </span>
              <div className="flex shrink-0 items-center gap-3">
                {removed ? (
                  <span className="text-xs text-red-600">Removed</span>
                ) : (
                  !binding.ready && (
                    <span className="text-xs text-orange-700">
                      Not in effect
                      {binding.error_reason ? `: ${binding.error_reason}` : ""}
                    </span>
                  )
                )}
                {button(binding.role, !removed)}
              </div>
            </div>
            {binding.error && !removed && (
              <span className="break-all text-xs text-gray-600">
                {binding.error}
              </span>
            )}
          </li>
        );
      })}
      {added.map((role) => (
        <li
          key={role}
          className="flex items-center justify-between gap-2 px-3 py-2"
        >
          <span className="break-all text-sm font-medium text-gray-900">
            {role}
          </span>
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-xs text-green-700">New</span>
            {button(role, true)}
          </div>
        </li>
      ))}
    </ul>
  );
}
