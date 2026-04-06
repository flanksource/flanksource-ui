import { Card, CardHeader } from "@flanksource-ui/components/ui/card";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { Avatar } from "@flanksource-ui/ui/Avatar";
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
    <Card className="rounded-xl border-gray-200 shadow-sm">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {user.type === "person" || !user.type ? (
              <Avatar size="sm" user={user} />
            ) : (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                {user.type === "team" ? (
                  <HiUserGroup className="h-3.5 w-3.5" />
                ) : (
                  <HiUser className="h-3.5 w-3.5" />
                )}
              </span>
            )}
            <div className="min-w-0">
              <div
                className="truncate text-sm font-semibold text-gray-900"
                title={user.name}
              >
                {user.name}
              </div>
              {user.email ? (
                <div
                  className="truncate text-xs text-gray-500"
                  title={user.email}
                >
                  {user.email}
                </div>
              ) : null}
            </div>
          </div>

          <div
            className={isMutating ? "pointer-events-none opacity-60" : ""}
            aria-disabled={isMutating || undefined}
          >
            <Switch
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
                    : "bg-gray-50 text-gray-700 ring-gray-200"
              }
            />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
