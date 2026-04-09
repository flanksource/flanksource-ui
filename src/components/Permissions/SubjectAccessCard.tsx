import SubjectAvatar, {
  PermissionSubjectType
} from "@flanksource-ui/components/Permissions/SubjectAvatar";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";

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

type SubjectAccessCardProps = {
  user: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
    type?: PermissionSubjectType;
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
  return (
    <div className="w-full max-w-3xl">
      <div className="flex items-center gap-3">
        <SubjectAvatar
          subject={{ name: user.name ?? user.id, type: user.type ?? "person" }}
          size="xs"
        />

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
