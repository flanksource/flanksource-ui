import { Switch } from "@flanksource-ui/ui/FormControls/Switch";
import { HiUser, HiUserGroup } from "react-icons/hi";

type AccessLevel = "deny" | "default" | "allow";
type SwitchOption = "Deny" | "Default" | "Allow";

const ACCESS_TO_OPTION: Record<AccessLevel, SwitchOption> = {
  deny: "Deny",
  default: "Default",
  allow: "Allow"
};

const OPTION_TO_ACCESS: Record<SwitchOption, AccessLevel> = {
  Deny: "deny",
  Default: "default",
  Allow: "allow"
};

const SWITCH_OPTIONS: SwitchOption[] = ["Deny", "Default", "Allow"];

const GROUP_TYPES = new Set(["team", "permission_subject_group", "role"]);

type SubjectAccessCardProps = {
  user: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
    type?: "team" | "permission_subject_group" | "person" | "role";
  };
  action: string;
  object: string;
  access: AccessLevel;
  onChangeAccess: (access: AccessLevel) => void;
  isMutating?: boolean;
};

export default function SubjectAccessCard({
  user,
  action,
  object,
  access,
  onChangeAccess,
  isMutating = false
}: SubjectAccessCardProps) {
  const isGroup = user.type ? GROUP_TYPES.has(user.type) : false;

  return (
    <div className="w-full max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-700">
          {isGroup ? (
            <HiUserGroup className="h-4 w-4" />
          ) : (
            <HiUser className="h-4 w-4" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <div className="min-w-0">
            <div
              className="truncate text-sm font-semibold text-gray-900"
              title={user.name}
            >
              {user.name}
            </div>
            {user.email && (
              <div
                className="mt-0.5 truncate text-xs text-gray-500"
                title={user.email}
              >
                {user.email}
              </div>
            )}
          </div>

          <div
            className={`shrink-0 ${isMutating ? "pointer-events-none opacity-60" : ""}`}
            aria-disabled={isMutating || undefined}
          >
            <Switch
              size="sm"
              options={SWITCH_OPTIONS}
              value={ACCESS_TO_OPTION[access]}
              onChange={(option) => onChangeAccess(OPTION_TO_ACCESS[option])}
              aria-label={`${action} on ${object} for ${user.name ?? user.id}`}
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
  );
}
