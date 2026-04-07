import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { HiUser, HiUserGroup } from "react-icons/hi";

type UserAccessCardProps = {
  user: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
    type?: "team" | "permission_subject_group" | "person" | "role";
  };
  action: string;
  object: string;
  access: "deny" | "default" | "allow";
  onChangeAccess: (access: "deny" | "default" | "allow") => void;
  isMutating?: boolean;
};

export default function UserAccessCard({
  user,
  action,
  object,
  access,
  onChangeAccess,
  isMutating = false
}: UserAccessCardProps) {
  return (
    <div className="w-full max-w-3xl">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-700">
          {user.type === "team" ||
          user.type === "permission_subject_group" ||
          user.type === "role" ? (
            <HiUserGroup className="h-4 w-4" />
          ) : (
            <HiUser className="h-4 w-4" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <div className="min-w-0">
            <div
              className="truncate text-sm font-semibold text-gray-900"
              title={user.name}
            >
              {user.name}
            </div>
            {user.email ? (
              <div
                className="mt-0.5 truncate text-xs text-gray-500"
                title={user.email}
              >
                {user.email}
              </div>
            ) : null}
          </div>

          <div className="shrink-0">
            <div
              className={isMutating ? "pointer-events-none opacity-60" : ""}
              aria-disabled={isMutating || undefined}
            >
              <Switch
                size="sm"
                options={["Deny", "Default", "Allow"]}
                value={
                  access === "deny"
                    ? "Deny"
                    : access === "allow"
                      ? "Allow"
                      : "Default"
                }
                onChange={(value) => {
                  const mapped =
                    value === "Deny"
                      ? "deny"
                      : value === "Allow"
                        ? "allow"
                        : "default";
                  onChangeAccess(mapped);
                }}
                className="h-auto"
                itemsClassName=""
                aria-label={`${action} on ${object} for ${user.name || user.id}`}
                getActiveItemClassName={(option) =>
                  option === "Allow"
                    ? "bg-blue-50 text-blue-700 ring-blue-200"
                    : option === "Deny"
                      ? "bg-red-50 text-red-700 ring-red-200"
                      : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
