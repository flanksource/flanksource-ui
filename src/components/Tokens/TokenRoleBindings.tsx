import { TokenRoleBinding } from "@flanksource-ui/api/services/tokens";

/** Lists the RoleBindings created with an access token, with the Role each limits it to. */
export function TokenRoleBindings({
  bindings = []
}: {
  bindings?: TokenRoleBinding[];
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
            {!binding.ready && (
              <span className="shrink-0 text-xs text-orange-700">
                Not in effect
                {binding.error_reason ? `: ${binding.error_reason}` : ""}
              </span>
            )}
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
