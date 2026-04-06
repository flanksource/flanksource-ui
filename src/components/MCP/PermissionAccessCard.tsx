import { PermissionsSummary } from "@flanksource-ui/api/types/permissions";
import { Button } from "@flanksource-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader
} from "@flanksource-ui/components/ui/card";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";

type PermissionAccessCardProps = {
  entity: {
    id: string;
    name: string;
    namespace?: string;
    icon?: string;
  };
  users: PermissionsSummary[];
  groups: PermissionsSummary[];
  subjectLookup?: Record<string, { name: string; type: string }>;
  globalOverride?: "allow" | "none" | "deny";
  onGlobalOverrideChange: (value: "allow" | "none" | "deny") => void;
  onAllowSelective: () => void;
  isMutating?: boolean;
};

function PermissionGroupItem({
  permission,
  subjectLookup
}: {
  permission: PermissionsSummary;
  subjectLookup?: Record<string, { name: string; type: string }>;
}) {
  if (permission.team) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
        <Icon name={permission.team.icon} className="h-3.5 w-3.5" />
        <span>Team: {permission.team.name}</span>
      </div>
    );
  }

  const lookup = permission.subject
    ? subjectLookup?.[permission.subject]
    : undefined;
  const groupName = lookup?.name || permission.group?.name || "Unknown group";

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
      <span>{groupName}</span>
    </div>
  );
}

function PermissionUserItem({
  permission
}: {
  permission: PermissionsSummary;
}) {
  if (!permission.person) {
    return (
      <div className="text-xs text-gray-600">
        {permission.subject || "Unknown user"}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar size="xs" user={permission.person} />
      <div className="flex items-center gap-1.5 text-xs text-gray-800">
        <span className="font-medium">{permission.person.name}</span>
        {permission.person.email && (
          <span className="text-gray-500">{permission.person.email}</span>
        )}
      </div>
    </div>
  );
}

export default function PermissionAccessCard({
  entity,
  users,
  groups,
  subjectLookup,
  globalOverride = "none",
  onGlobalOverrideChange,
  onAllowSelective,
  isMutating = false
}: PermissionAccessCardProps) {
  return (
    <Card className="rounded-xl border-gray-200 shadow-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-700">
            <Icon name={entity.icon || "playbook"} className="h-5 w-5" />
          </div>

          <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
            <div className="min-w-0">
              <div
                className="truncate text-sm font-semibold text-gray-900"
                title={entity.name}
              >
                {entity.name}
              </div>
              {entity.namespace ? (
                <div
                  className="mt-0.5 truncate text-xs text-gray-500"
                  title={entity.namespace}
                >
                  {entity.namespace}
                </div>
              ) : null}
            </div>

            <div className="shrink-0">
              <div
                className={isMutating ? "pointer-events-none opacity-60" : ""}
              >
                <Switch
                  options={["Deny all", "Custom", "Allow all"]}
                  value={
                    globalOverride === "deny"
                      ? "Deny all"
                      : globalOverride === "allow"
                        ? "Allow all"
                        : "Custom"
                  }
                  onChange={(value) => {
                    const mappedValue =
                      value === "Deny all"
                        ? "deny"
                        : value === "Allow all"
                          ? "allow"
                          : "none";

                    onGlobalOverrideChange(mappedValue);
                  }}
                  className="h-auto"
                  itemsClassName=""
                  getActiveItemClassName={(option) =>
                    option === "Allow all"
                      ? "bg-blue-50 text-blue-700 ring-blue-200"
                      : option === "Deny all"
                        ? "bg-red-50 text-red-700 ring-red-200"
                        : undefined
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-4 border-t border-gray-200 p-4 pt-3">
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Groups
            </div>
            {groups.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {groups.map((groupPermission) => (
                  <PermissionGroupItem
                    key={groupPermission.id}
                    permission={groupPermission}
                    subjectLookup={subjectLookup}
                  />
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No groups have access</div>
            )}
          </div>

          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Users
            </div>
            {users.length > 0 ? (
              <div className="space-y-2">
                {users.map((userPermission) => (
                  <PermissionUserItem
                    key={userPermission.id}
                    permission={userPermission}
                  />
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No users have access</div>
            )}
          </div>

          <div>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={onAllowSelective}
            >
              + Add user or group
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
