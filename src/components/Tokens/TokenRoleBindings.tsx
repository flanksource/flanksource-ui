import { TokenRoleBinding } from "@flanksource-ui/api/services/tokens";
import { FaTrash } from "react-icons/fa";

/** Lists the RoleBindings that limit an access token, with the Role each limits it to. */
export function TokenRoleBindings({
  bindings = [],
  onRemove,
  disabled = false
}: {
  bindings?: TokenRoleBinding[];
  /** Shows a button on each binding that removes it */
  onRemove?: (binding: TokenRoleBinding) => void;
  disabled?: boolean;
}) {
  if (bindings.length === 0) {
    return (
      <p className="rounded-md border bg-gray-50 p-3 text-sm text-orange-700">
        No role binding limits this token, so it can do nothing.
      </p>
    );
  }

  return (
    <ul className="max-h-48 divide-y overflow-y-auto rounded-md border bg-gray-50">
      {bindings.map((binding) => (
        <li key={binding.id} className="flex flex-col gap-0.5 px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="break-all text-sm font-medium text-gray-900">
              {binding.role}
            </span>
            <div className="flex shrink-0 items-center gap-3">
              {!binding.ready && (
                <span className="text-xs text-orange-700">
                  Not in effect
                  {binding.error_reason ? `: ${binding.error_reason}` : ""}
                </span>
              )}
              {onRemove && (
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`Remove ${binding.role}`}
                  title={`Remove ${binding.role}`}
                  className="text-gray-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => onRemove(binding)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
          {binding.error && (
            <span className="break-all text-xs text-gray-600">
              {binding.error}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
